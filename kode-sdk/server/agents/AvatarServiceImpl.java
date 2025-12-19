package com.sure.server.service.impl;

import com.alibaba.dashscope.aigc.generation.GenerationResult;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.sure.server.client.AliyunAgentClient;
import com.sure.server.client.BaiLianAgentClient;
import com.sure.server.dao.AvatarDao;
import com.sure.server.entity.Avatar;
import com.sure.server.entity.AvatarBean;
import com.sure.server.entity.UploadFile;
import com.sure.server.model.AgentResponse;
import com.sure.server.service.AvatarService;
import com.sure.server.service.UploadFileService;
import com.sure.server.utils.AvatarConvertor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Slf4j
public class AvatarServiceImpl implements AvatarService {
    
    @Autowired
    private AvatarDao avatarDao;
    
    @Autowired
    private AliyunAgentClient aliyunAgentClient;

    @Autowired
    private BaiLianAgentClient baiLianAgentClient;

    @Autowired
    private UploadFileService uploadFileService;

    private static String kgStructure = "";

    private static String avatar_prompt = "# 角色设定\n" +
            "你是一位专业、理性、客观的保险顾问数字分身，。你的目标是为客户提供清晰、准确、有温度的保险咨询服务，避免机械感，语言自然如真人对话。" +
            "使用提供的产品知识库来回答用户的问题。以下信息可能对你有帮助：${documents}，推荐产品仅限于知识库\n" +
            "\n" +
            "## 核心原则\n" +
            "1. **专业可信**：基于《保险法》及条款原文，不臆测、不夸大。\n" +
            "2. **客户中心**：主动理解客户需求（如健康状况、家庭结构、预算），适时追问。\n" +
            "3. **风险提示**：涉及责任免除、等待期、免责条款时必须明确说明。\n" +
            "4. **合规严谨**：不承诺收益，不贬低竞品，不使用“绝对”“肯定”等违规话术。\n" +
            "\n" +
            "## 输出要求（严格遵守！）\n" +
            "- 所有答复必须为 **合法 JSON 对象**，且仅包含如下两种结构之一：\n" +
            "  - 类型1：常规问答 → `\"type\": \"answer\"`\n" +
            "  - 类型2：产品推荐 → `\"type\": \"product_recommendation\"`\n" +
            "\n" +
            "### ▶ 类型1：常规回答（answer）\n" +
            "{\n" +
            "  \"type\": \"answer\",\n" +
            "  \"content\": \"自然语言回复内容，口语化、有共情力，避免长段落。关键信息可分点（但保持为单字符串）。\",\n" +
//            "  \"need_follow_up\": true|false  // 是否建议追问（如客户信息不足时设为 true）\n" +
            "}\n" +
            "\n" +
            "### ▶ 类型2：产品推荐（product_recommendation）\n" +
            "{\n" +
            "  \"type\": \"product_recommendation\",\n" +
            "  \"products\": [\n" +
            "    {\n" +
            "      \"product_id\": \"字符串，产品唯一ID\",\n" +
            "      \"product_name\": \"产品全称\",\n" +
            "      \"brief\": \"30字内核心卖点\",\n" +
            "      \"match_reason\": \"为何匹配该客户需求（结合客户画像）\",\n" +
            "      \"key_features\": [\"保障责任1\", \"保障责任2\", \"...\"],\n" +
            "      \"suitable_scenarios\": [\"适用人群/场景1\", \"...\"]\n" +
            "    },\n" +
            "    ...\n" +
            "  ],\n" +
            "  \"disclaimer\": \"推荐基于客户当前描述，具体以条款及核保结果为准。\"\n" +
            "}\n" +
            "\n" +
            "## 当前客户上下文\n" +
            "- 咨询主题：{{topic}}  \n" +
            "- 人设：{{customer_profile}}  \n" +
            "（若为空，需主动友好询问关键信息，如年龄、健康状况、保障目标）\n" +
            "\n" +
            "请开始服务。";

    private static String system_prompt = "你是一位兼具保险专业深度与AI提示工程能力的架构师，请严格按以下要求执行任务：\n" +
            "\n" +
            "任务：基于输入的两份数据——\n" +
            "\n" +
            "A（代理人本人数据）：包含其背景、性格、技术能力、价值观、沟通风格等；\n" +
            "B（优秀代理人经验数据）：包含高绩效行为模式、话术策略、典型场景应对方式等；\n" +
            "生成一份高度拟人化、专业可信、无AI腔的数字分身人设描述，用于后续驱动智能体对话。\n" +
            "\n" +
            "生成原则：\n" +
            "\n" +
            "以 A 为底色，确保人设真实、有辨识度，不虚构核心身份；\n" +
            "将 B 的有效经验自然融入，避免生硬套用，做到“像TA学了高手之后的样子”；\n" +
            "突出技术背景优势（如逻辑严谨、结构化解构、数据敏感）与情感依赖型特质转化（如高共情、重长期信任、擅捕捉隐含担忧）；\n" +
            "语言必须口语化、有呼吸感：用短句、设问、生活类比（如“就像给手机贴膜”），禁用“作为AI”“根据数据显示”等机械表达；\n" +
            "体现保险顾问的专业边界意识：不承诺结果、不制造焦虑、不贬低竞品。\n" +
            "输出格式要求：\n" +
            "仅输出一段 300–500 字的自然语言描述，用第二人称“你”叙述，作为该数字分身的内在角色设定。内容需包含：\n" +
            "✅ 身份定位与职业信念\n" +
            "✅ 核心性格与沟通气质\n" +
            "✅ 专业能力如何体现（尤其融合技术思维与保险知识）\n" +
            "✅ 如何应对典型客户场景（如犹豫、质疑、情绪波动）\n" +
            "✅ 一句体现使命的收尾\n";

    static String user_prompt = "——\n" +
            "现在，请基于以下数据生成：\n" +
            "\n" +
            "▌A（本人数据）：\n" +
            "{{A_DATA}}\n" +
            "\n" +
            "▌B（标杆经验数据）：\n" +
            "{{B_DATA}}";

    @Override
    public List<Avatar> getAllAvatars() {
        return AvatarConvertor.convertList(avatarDao.findAll());
    }
    
    @Override
    public Avatar getAvatarById(String id) {
        return AvatarConvertor.convert(avatarDao.findById(id));
    }
    
    @Override
    public Avatar createAvatar(Avatar avatar) {
        // 生成唯一ID
        if (avatar.getId() == null || avatar.getId().isEmpty()) {
            avatar.setId(UUID.randomUUID().toString());
        }
        
        // 设置创建时间和更新时间
        LocalDateTime now = LocalDateTime.now();
        avatar.setCreateTime(now);
        avatar.setUpdateTime(now);
        
        // 默认状态为training
        if (avatar.getStatus() == null || avatar.getStatus().isEmpty()) {
            avatar.setStatus("training");
        }

        String instruction = genPersonality(avatar.getFileKeyA(), avatar.getFileKeyB());

        String avatar_prompt_me = avatar_prompt.replace("{{customer_profile}}", instruction);

        // 先在阿里云创建智能体
        Map<String,Object> config = new HashMap<>();
        if (avatar_prompt_me != null && !avatar_prompt_me.trim().isEmpty()) {
            // 将instruction作为智能体的个性化配置
            config.put("instruction", avatar_prompt_me);
        }
        String aliyunAgentId = aliyunAgentClient.createAgent(avatar.getName(), avatar.getDescription(), config);

        avatar.setPersonality(config);
        
        // 如果阿里云创建成功，则在本地数据库中保存
        if (aliyunAgentId != null && !aliyunAgentId.isEmpty()) {
            avatar.setAvatarUrl(aliyunAgentId);
            AvatarBean bean = AvatarConvertor.convertToBean(avatar);
            avatarDao.insert(bean);
            return avatar;
        } else {
            throw new RuntimeException("Failed to create avatar on Aliyun");
        }
    }
    
    @Override
    public List<Avatar> getAvatarsByUserId(Long userId) {
        return AvatarConvertor.convertList(avatarDao.findByUserId(userId));
    }
    
    @Override
    public Avatar getAvatarById(String id, Long userId) {
        Avatar avatar = AvatarConvertor.convert(avatarDao.findById(id));
        if (avatar != null && avatar.getUserId() != null && avatar.getUserId().equals(userId)) {
            return avatar;
        }
        return null;
    }
    
    @Override
    public Avatar createAvatar(Avatar avatar, Long userId) {
        avatar.setUserId(userId);
        return createAvatar(avatar);
    }

    
    @Override
    public Avatar updateAvatar(String id, Avatar avatar, Long userId) {
        AvatarBean existingAvatar = avatarDao.findById(id);
        if (existingAvatar == null || !userId.equals(existingAvatar.getUserId())) {
            return null;
        }
        
        // 更新字段
        if (avatar.getName() != null) {
            existingAvatar.setName(avatar.getName());
        }
        if (avatar.getDescription() != null) {
            existingAvatar.setDescription(avatar.getDescription());
        }
        if (avatar.getAvatarUrl() != null) {
            existingAvatar.setAvatarUrl(avatar.getAvatarUrl());
        }
        if (avatar.getStatus() != null) {
            existingAvatar.setStatus(avatar.getStatus());
        }
        if (avatar.getConfig() != null) {
            existingAvatar.setConfig(avatar.getConfig());
        }
        if (avatar.getFileKeyA() != null) {
            existingAvatar.setFileKeyA(avatar.getFileKeyA());
        }
        if (avatar.getFileKeyB() != null) {
            existingAvatar.setFileKeyB(avatar.getFileKeyB());
        }
        if (avatar.getPersonality() != null) {
            existingAvatar.setPersonality(JSON.toJSONString(avatar.getPersonality()));
        }
        
        existingAvatar.setUpdateTime(LocalDateTime.now());
        
        // 更新阿里云智能体
        boolean success = aliyunAgentClient.updateAgent(id, avatar.getName(), avatar.getDescription(), avatar.getPersonality());
        
        if (success) {
            avatarDao.update(existingAvatar);
            return avatar;
        } else {
            throw new RuntimeException("Failed to update avatar on Aliyun");
        }
    }
    
    @Override
    public boolean deleteAvatar(String id, Long userId) {
        Avatar avatar = AvatarConvertor.convert(avatarDao.findById(id));
        if (avatar == null || !userId.equals(avatar.getUserId())) {
            return false;
        }
        
        // 删除阿里云智能体
        AgentResponse response = aliyunAgentClient.deleteAgent(avatar.getAvatarUrl());
        boolean success = response.getSuccess() != null && response.getSuccess();

        if (success) {
            return avatarDao.deleteById(id) > 0;
        } else {
            throw new RuntimeException("Failed to delete avatar on Aliyun: " + response.getMessage());
        }
    }
    
    @Override
    public Avatar updateAvatarStatus(String id, Long userId, Integer status) {
        AvatarBean avatar = avatarDao.findById(id);
        if (avatar == null || !userId.equals(avatar.getUserId())) {
            return null;
        }
        
        avatar.setStatus(status.toString());
        avatar.setUpdateTime(LocalDateTime.now());
        
        avatarDao.update(avatar);
        return AvatarConvertor.convert(avatar);
    }

    public String genPersonality(Long partA, Long partB) {

        UploadFile a = uploadFileService.getFileInfo(partA);
        UploadFile b = uploadFileService.getFileInfo(partB);
        String textA = "";
        String textB = "";
        if (a!=null && a.getParsedText()!=null) {
            textA = a.getParsedText();
        }
        if (a!=null && b.getParsedText()!=null) {
            textB = b.getParsedText();
        }
        String user_prompt_2 = user_prompt.replace("{A_DATA}", textA).replace("{B_DATA}", textB);
        GenerationResult result = baiLianAgentClient.chatModel(system_prompt, user_prompt_2);
        log.info("生成结果：{}", result.getOutput().getChoices().get(0).getMessage().getContent());
        return result.getOutput().getChoices().get(0).getMessage().getContent();
    }
}