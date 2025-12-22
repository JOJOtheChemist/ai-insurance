# 产品对比 AI hook 设计方案

> ✅ **实现已完成** - 2025-12-22

## 1. 前端位置定位 ✅

已找到目标位置：

| 文件 | 行号 | 说明 |
|------|------|------|
| [CompareDock.tsx](file:///Users/yeya/Documents/HBuilderProjects/ai保险-产品详情页/react-app/src/components/InsuranceProductList/CompareDock.tsx#L20) | L20 | "AI 分析" 按钮，目前无点击事件 |
| [InsuranceProductList.tsx](file:///Users/yeya/Documents/HBuilderProjects/ai保险-产品详情页/react-app/src/components/InsuranceProductList/InsuranceProductList.tsx#L18) | L18 | `selectedProducts` 状态，使用 `Set<number>` 存储选中产品ID |
| [InsuranceProductList.tsx](file:///Users/yeya/Documents/HBuilderProjects/ai保险-产品详情页/react-app/src/components/InsuranceProductList/InsuranceProductList.tsx#L72-L79) | L72-79 | 现有的 `handleAiAnalysis` 单产品分析逻辑 (可参考) |

## 2. 传参模式 ✅ 已有先例

现有代码已有传参先例，见 `InsuranceProductList.tsx` L72-79：

```tsx
const handleAiAnalysis = (product: Product) => {
    navigate('/composite-chat-full', {
        state: {
            initialMessage: `请分析一下 ${product.company_name} 的 ${product.product_name} 有哪些核心卖点？`,
            productContext: product
        }
    });
};
```

**传参方式**：通过 `react-router-dom` 的 `navigate()` + `state` 传递 `initialMessage` 。

## 3. Hook 条件性触发 ✅ 已理解

`CompositeChatFullPage.tsx` 需要处理来自 `useLocation().state` 的 `initialMessage`，并在页面加载时自动发送。

这可以通过以下模式实现：

```tsx
// CompositeChatFullPage.tsx
import { useLocation } from 'react-router-dom';

const CompositeChatFullPage = () => {
    const location = useLocation();
    const initialMessage = location.state?.initialMessage;
    const productContext = location.state?.productContext;
    
    useEffect(() => {
        if (initialMessage) {
            // 条件性触发：只在有 initialMessage 时自动发送首轮对话
            handleStartChat(initialMessage);
        }
    }, [initialMessage]);
    
    // ...
};
```

---

## 4. 实现方案总结

### 4.1 需要修改的文件

| 文件 | 改动说明 |
|------|---------|
| `CompareDock.tsx` | 添加 `onClick` 事件，接收选中产品列表，构造对比提示词 |
| `InsuranceProductList.tsx` | 新增 `handleAiCompare()` 函数，传入多产品对比的 `initialMessage` |
| `CompositeChatFullPage.tsx` | 确保能处理 `initialMessage` 自动触发首轮对话 |

### 4.2 对比提示词构造逻辑

```tsx
const handleAiCompare = () => {
    // 1. 根据 selectedProducts (Set<number>) 获取完整产品信息
    const selectedProductList = products.filter(p => selectedProducts.has(p.id));
    
    // 2. 构造产品名称列表
    const productNames = selectedProductList.map(p => 
        `${p.company_name}的${p.product_name}`
    ).join('、');
    
    // 3. 导航到聊天页，传入对比提示词
    navigate('/composite-chat-full', {
        state: {
            initialMessage: `请帮我对比分析以下保险产品：${productNames}。从保障范围、保费价格、核保条件、增值服务等维度进行对比分析。`,
            compareProducts: selectedProductList  // 可选：传入完整产品信息供上下文使用
        }
    });
};
```

### 4.3 Hook 文件设计（可选抽象）

如需抽象为独立 hook，可创建：

```
/react-app/src/hooks/useProductCompare.ts
```

```tsx
import { useNavigate } from 'react-router-dom';
import type { Product } from '../services/productApi';

export const useProductCompare = () => {
    const navigate = useNavigate();
    
    const triggerCompare = (selectedProducts: Product[]) => {
        if (selectedProducts.length < 2) {
            alert('请至少选择2款产品进行对比');
            return;
        }
        
        const productNames = selectedProducts.map(p => 
            `${p.company_name}的${p.product_name}`
        ).join('、');
        
        navigate('/composite-chat-full', {
            state: {
                initialMessage: `请帮我对比分析以下保险产品：${productNames}。从保障范围、保费价格、核保条件、增值服务等维度进行对比分析。`,
                compareProducts: selectedProducts
            }
        });
    };
    
    return { triggerCompare };
};
```

---

## 5. 能力评估总结

| 能力项 | 状态 | 说明 |
|--------|------|------|
| **前端位置定位** | ✅ 已找到 | `CompareDock.tsx` L20 的 "AI 分析" 按钮 |
| **传参机制** | ✅ 完全理解 | 使用 `navigate()` + `state.initialMessage` |
| **条件性触发** | ✅ 会写 | 通过 `useEffect` 监听 `initialMessage` 触发 `handleStartChat()` |
| **提示词构造** | ✅ 可实现 | 从 `selectedProducts` 提取产品名构造对比提示 |

> [!WARNING]
> **发现问题**：`CompositeChatFullPage.tsx` 目前 **没有** 使用 `useLocation().state` 获取 `initialMessage`，也没有传递给 `CompositeDigitalHumanChat` 组件。需要补充这部分逻辑才能让自动首轮对话生效。

> [!TIP]
> 大模型会收到用户的对比请求后，自动调用搜索工具获取产品详情进行智能对比分析。

---

## 6. 下一步

准备好实施后，需要：
1. 修改 `CompareDock.tsx` 添加点击事件 props
2. 在 `InsuranceProductList.tsx` 实现 `handleAiCompare()` 并传给 `CompareDock`
3. 验证 `CompositeChatFullPage.tsx` 是否已支持 `initialMessage` 自动触发
