/**
 * 业务文件编辑工具使用示例
 * 
 * 这个文件展示了如何使用 business_edit_template 创建业务工具
 */

import { createBusinessEditTool, createArrayBusinessTool } from './business_edit_template';
import { z } from 'zod';

// ============================================================================
// 示例1：配置文件编辑工具（完全自定义）
// ============================================================================

const configItemSchema = z.object({
  id: z.string().min(1),
  key: z.string().min(1),
  value: z.union([z.string(), z.number(), z.boolean()]),
  environment: z.enum(['dev', 'staging', 'prod']).optional(),
});

export const ConfigEdit = createBusinessEditTool({
  name: 'config_edit',
  description: 'Edit application configuration files',
  dataSchema: configItemSchema,
  fileFormat: 'json',
  
  validator: async (data, existing, operation) => {
    const errors = [];
    
    // 检查 key 命名规范
    if (!/^[A-Z_][A-Z0-9_]*$/.test(data.key)) {
      errors.push({
        field: 'key',
        message: `Invalid key format: ${data.key}`,
        code: 'INVALID_FORMAT',
      });
    }
    
    // 检查重复 ID
    if (operation === 'create' && existing.items?.some((item: any) => item.id === data.id)) {
      errors.push({
        field: 'id',
        message: `ID ${data.id} already exists`,
        code: 'DUPLICATE_ID',
      });
    }
    
    return {
      valid: errors.length === 0,
      error: errors.length > 0 ? errors.map(e => e.message).join('; ') : undefined,
      errors: errors.length > 0 ? errors : undefined,
    };
  },
  
  operator: (existing, newData, operation) => {
    const updated = { ...existing };
    if (!updated.items) {
      updated.items = [];
    }
    
    switch (operation) {
      case 'create':
        updated.items.push(newData);
        break;
      case 'update':
        const index = updated.items.findIndex((item: any) => item.id === newData.id);
        if (index !== -1) {
          updated.items[index] = { ...updated.items[index], ...newData };
        }
        break;
      case 'delete':
        updated.items = updated.items.filter((item: any) => item.id !== newData.id);
        break;
    }
    
    return updated;
  },
  
  metadata: {
    version: '1.0',
    tags: ['config', 'business'],
  },
});

// ============================================================================
// 示例2：API端点管理工具（使用快速创建函数）
// ============================================================================

const endpointSchema = z.object({
  id: z.string(),
  path: z.string(),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE']),
  handler: z.string(),
});

export const ApiEndpointEdit = createArrayBusinessTool({
  name: 'api_endpoint_edit',
  description: 'Edit API endpoint definitions',
  itemSchema: endpointSchema,
  idField: 'id',
  fileFormat: 'json',
  
  // 可选：添加额外校验
  validator: async (data, existing, operation) => {
    const errors = [];
    
    // 检查路径格式
    if (!data.path.startsWith('/')) {
      errors.push({
        field: 'path',
        message: 'Path must start with /',
        code: 'INVALID_PATH',
      });
    }
    
    // 默认的ID检查会由快速创建函数自动处理
    return {
      valid: errors.length === 0,
      error: errors.length > 0 ? errors.map(e => e.message).join('; ') : undefined,
      errors: errors.length > 0 ? errors : undefined,
    };
  },
});

