
window.onload = function() {
  // Build a system
  let url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  let options = {
  "swaggerDoc": {
    "openapi": "3.0.0",
    "paths": {
      "/": {
        "get": {
          "operationId": "AppController_getHello",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "App"
          ]
        }
      },
      "/api/users/register": {
        "post": {
          "description": "创建新的用户账户，需要提供姓名、邮箱、密码和用户名",
          "operationId": "UserController_register",
          "parameters": [],
          "requestBody": {
            "required": true,
            "description": "用户注册信息",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RegisterDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "注册成功",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UserResponseDto"
                  }
                }
              }
            },
            "400": {
              "description": "请求参数错误",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "statusCode": {
                        "type": "number",
                        "example": 400
                      },
                      "message": {
                        "type": "array",
                        "items": {
                          "type": "string"
                        },
                        "example": [
                          "邮箱格式不正确",
                          "密码至少6位"
                        ]
                      },
                      "error": {
                        "type": "string",
                        "example": "Bad Request"
                      }
                    }
                  }
                }
              }
            },
            "409": {
              "description": "邮箱或用户名已存在",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "statusCode": {
                        "type": "number",
                        "example": 409
                      },
                      "message": {
                        "type": "string",
                        "example": "邮箱已被注册"
                      },
                      "error": {
                        "type": "string",
                        "example": "Conflict"
                      }
                    }
                  }
                }
              }
            }
          },
          "summary": "用户注册",
          "tags": [
            "用户管理"
          ]
        }
      },
      "/api/users/profile": {
        "get": {
          "description": "获取当前登录用户的详细个人信息",
          "operationId": "UserController_getProfile",
          "parameters": [],
          "responses": {
            "200": {
              "description": "获取成功",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UserProfileResponseDto"
                  }
                }
              }
            },
            "401": {
              "description": "未认证，请先登录"
            }
          },
          "security": [
            {
              "jwt": []
            }
          ],
          "summary": "获取当前用户信息",
          "tags": [
            "用户管理"
          ]
        },
        "put": {
          "description": "更新当前登录用户的个人信息",
          "operationId": "UserController_updateProfile",
          "parameters": [],
          "requestBody": {
            "required": true,
            "description": "用户更新信息",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateUserDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "更新成功",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UserProfileResponseDto"
                  }
                }
              }
            },
            "400": {
              "description": "请求参数错误"
            },
            "401": {
              "description": "未认证，请先登录"
            }
          },
          "security": [
            {
              "jwt": []
            }
          ],
          "summary": "更新用户信息",
          "tags": [
            "用户管理"
          ]
        }
      },
      "/api/users/{id}": {
        "get": {
          "description": "获取指定用户的公开信息",
          "operationId": "UserController_findOne",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "description": "用户ID",
              "schema": {
                "example": 1,
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "获取成功",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UserResponseDto"
                  }
                }
              }
            },
            "404": {
              "description": "用户不存在"
            }
          },
          "summary": "根据ID获取用户信息",
          "tags": [
            "用户管理"
          ]
        }
      },
      "/api/articles": {
        "post": {
          "description": "创建一篇新的博客文章，需要登录后才能操作",
          "operationId": "ArticleController_create",
          "parameters": [],
          "requestBody": {
            "required": true,
            "description": "文章创建数据",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateArticleDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "文章创建成功",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ArticleResponseDto"
                  }
                }
              }
            },
            "400": {
              "description": "请求参数错误"
            },
            "401": {
              "description": "未登录"
            }
          },
          "security": [
            {
              "jwt": []
            }
          ],
          "summary": "创建文章",
          "tags": [
            "博客文章"
          ]
        },
        "get": {
          "description": "获取博客文章列表，支持分页、搜索和筛选",
          "operationId": "ArticleController_findAll",
          "parameters": [
            {
              "name": "page",
              "required": false,
              "in": "query",
              "description": "页码，从1开始",
              "schema": {
                "example": 1,
                "type": "number"
              }
            },
            {
              "name": "limit",
              "required": false,
              "in": "query",
              "description": "每页数量，默认10条，最大100条",
              "schema": {
                "example": 10,
                "type": "number"
              }
            },
            {
              "name": "search",
              "required": false,
              "in": "query",
              "description": "搜索关键词，模糊匹配标题和内容",
              "schema": {
                "example": "NestJS",
                "type": "string"
              }
            },
            {
              "name": "status",
              "required": false,
              "in": "query",
              "description": "文章状态筛选",
              "schema": {
                "enum": [
                  "published",
                  "draft"
                ],
                "type": "string"
              }
            },
            {
              "name": "categoryId",
              "required": false,
              "in": "query",
              "description": "分类ID筛选",
              "schema": {
                "example": 1,
                "type": "number"
              }
            },
            {
              "name": "tagId",
              "required": false,
              "in": "query",
              "description": "标签ID筛选",
              "schema": {
                "example": 1,
                "type": "number"
              }
            },
            {
              "name": "authorId",
              "required": false,
              "in": "query",
              "description": "作者ID筛选",
              "schema": {
                "example": 1,
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "获取成功",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ArticleListResponseDto"
                  }
                }
              }
            }
          },
          "summary": "获取文章列表",
          "tags": [
            "博客文章"
          ]
        }
      },
      "/api/articles/{id}": {
        "get": {
          "description": "获取指定ID的文章详细信息，包含完整内容、分类、标签等",
          "operationId": "ArticleController_findOne",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "description": "文章ID",
              "schema": {
                "example": 1,
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "获取成功",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ArticleDetailResponseDto"
                  }
                }
              }
            },
            "404": {
              "description": "文章不存在"
            }
          },
          "summary": "根据ID获取文章详情",
          "tags": [
            "博客文章"
          ]
        },
        "patch": {
          "description": "更新指定ID的文章信息，只有作者本人可以更新",
          "operationId": "ArticleController_update",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "description": "文章ID",
              "schema": {
                "example": 1,
                "type": "number"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "description": "文章更新数据",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateArticleDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "更新成功",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ArticleResponseDto"
                  }
                }
              }
            },
            "401": {
              "description": "未认证"
            },
            "403": {
              "description": "无权限，只能更新自己的文章"
            },
            "404": {
              "description": "文章不存在"
            }
          },
          "security": [
            {
              "jwt": []
            }
          ],
          "summary": "更新文章",
          "tags": [
            "博客文章"
          ]
        },
        "delete": {
          "description": "删除指定ID的文章，只有作者本人可以删除",
          "operationId": "ArticleController_remove",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "description": "文章ID",
              "schema": {
                "example": 1,
                "type": "number"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "删除成功"
            },
            "401": {
              "description": "未认证"
            },
            "403": {
              "description": "无权限，只能删除自己的文章"
            },
            "404": {
              "description": "文章不存在"
            }
          },
          "security": [
            {
              "jwt": []
            }
          ],
          "summary": "删除文章",
          "tags": [
            "博客文章"
          ]
        }
      },
      "/api/articles/{id}/like": {
        "post": {
          "description": "给指定文章点赞，如果已点赞则取消点赞",
          "operationId": "ArticleController_toggleLike",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "description": "文章ID",
              "schema": {
                "example": 1,
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "操作成功",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "liked": {
                        "type": "boolean",
                        "example": true,
                        "description": "是否已点赞"
                      },
                      "likeCount": {
                        "type": "number",
                        "example": 39,
                        "description": "总点赞数"
                      }
                    }
                  }
                }
              }
            },
            "401": {
              "description": "未认证"
            },
            "404": {
              "description": "文章不存在"
            }
          },
          "security": [
            {
              "jwt": []
            }
          ],
          "summary": "点赞文章",
          "tags": [
            "博客文章"
          ]
        }
      },
      "/api/articles/{id}/save": {
        "post": {
          "description": "收藏指定文章，如果已收藏则取消收藏",
          "operationId": "ArticleController_toggleSave",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "description": "文章ID",
              "schema": {
                "example": 1,
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "操作成功",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "saved": {
                        "type": "boolean",
                        "example": true,
                        "description": "是否已收藏"
                      },
                      "message": {
                        "type": "string",
                        "example": "收藏成功"
                      }
                    }
                  }
                }
              }
            },
            "401": {
              "description": "未认证"
            },
            "404": {
              "description": "文章不存在"
            }
          },
          "security": [
            {
              "jwt": []
            }
          ],
          "summary": "收藏文章",
          "tags": [
            "博客文章"
          ]
        }
      },
      "/api/articles/user/{userId}": {
        "get": {
          "description": "获取指定用户发布的所有文章列表",
          "operationId": "ArticleController_findByUser",
          "parameters": [
            {
              "name": "userId",
              "required": true,
              "in": "path",
              "description": "用户ID",
              "schema": {
                "example": 1,
                "type": "number"
              }
            },
            {
              "name": "page",
              "required": false,
              "in": "query",
              "description": "页码",
              "schema": {
                "example": 1,
                "type": "number"
              }
            },
            {
              "name": "limit",
              "required": false,
              "in": "query",
              "description": "每页数量",
              "schema": {
                "example": 10,
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "获取成功",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ArticleListResponseDto"
                  }
                }
              }
            },
            "404": {
              "description": "用户不存在"
            }
          },
          "summary": "获取指定用户的文章列表",
          "tags": [
            "博客文章"
          ]
        }
      },
      "/api/articles/my/drafts": {
        "get": {
          "description": "获取当前用户的所有草稿文章",
          "operationId": "ArticleController_getMyDrafts",
          "parameters": [
            {
              "name": "page",
              "required": false,
              "in": "query",
              "description": "页码",
              "schema": {
                "example": 1,
                "type": "number"
              }
            },
            {
              "name": "limit",
              "required": false,
              "in": "query",
              "description": "每页数量",
              "schema": {
                "example": 10,
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "获取成功",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ArticleListResponseDto"
                  }
                }
              }
            },
            "401": {
              "description": "未认证"
            }
          },
          "security": [
            {
              "jwt": []
            }
          ],
          "summary": "获取我的草稿列表",
          "tags": [
            "博客文章"
          ]
        }
      },
      "/api/auth/login": {
        "post": {
          "description": "用户使用邮箱和密码登录系统，成功后返回JWT访问令牌",
          "operationId": "AuthController_login",
          "parameters": [],
          "requestBody": {
            "required": true,
            "description": "登录凭据",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/LoginDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "登录成功",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "access_token": {
                        "type": "string",
                        "example": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                        "description": "JWT访问令牌"
                      },
                      "user": {
                        "type": "object",
                        "properties": {
                          "id": {
                            "type": "number",
                            "example": 1
                          },
                          "username": {
                            "type": "string",
                            "example": "zhangsan2024"
                          },
                          "email": {
                            "type": "string",
                            "example": "zhangsan@university.edu.cn"
                          },
                          "nickname": {
                            "type": "string",
                            "example": "张三"
                          },
                          "role": {
                            "type": "string",
                            "example": "user"
                          }
                        }
                      },
                      "expires_in": {
                        "type": "number",
                        "example": 3600,
                        "description": "令牌过期时间（秒）"
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "请求参数错误",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "statusCode": {
                        "type": "number",
                        "example": 400
                      },
                      "message": {
                        "type": "array",
                        "items": {
                          "type": "string"
                        },
                        "example": [
                          "请输入有效的邮箱地址",
                          "密码至少6位"
                        ]
                      },
                      "error": {
                        "type": "string",
                        "example": "Bad Request"
                      }
                    }
                  }
                }
              }
            },
            "401": {
              "description": "认证失败",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "statusCode": {
                        "type": "number",
                        "example": 401
                      },
                      "message": {
                        "type": "string",
                        "example": "邮箱或密码错误"
                      },
                      "error": {
                        "type": "string",
                        "example": "Unauthorized"
                      }
                    }
                  }
                }
              }
            }
          },
          "summary": "用户登录",
          "tags": [
            "用户认证"
          ]
        }
      },
      "/api/auth/logout": {
        "post": {
          "description": "用户主动登出系统，使当前令牌失效",
          "operationId": "AuthController_logout",
          "parameters": [],
          "responses": {
            "200": {
              "description": "登出成功",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "message": {
                        "type": "string",
                        "example": "登出成功"
                      }
                    }
                  }
                }
              }
            },
            "401": {
              "description": "未认证"
            }
          },
          "security": [
            {
              "jwt": []
            }
          ],
          "summary": "用户登出",
          "tags": [
            "用户认证"
          ]
        }
      },
      "/api/auth/me": {
        "get": {
          "description": "通过JWT令牌获取当前登录用户的基本信息",
          "operationId": "AuthController_getCurrentUser",
          "parameters": [],
          "responses": {
            "200": {
              "description": "获取成功",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "id": {
                        "type": "number",
                        "example": 1
                      },
                      "username": {
                        "type": "string",
                        "example": "zhangsan2024"
                      },
                      "email": {
                        "type": "string",
                        "example": "zhangsan@university.edu.cn"
                      },
                      "nickname": {
                        "type": "string",
                        "example": "张三"
                      },
                      "role": {
                        "type": "string",
                        "example": "user"
                      },
                      "status": {
                        "type": "string",
                        "example": "active"
                      },
                      "createdAt": {
                        "type": "string",
                        "example": "2023-12-01T10:30:00.000Z"
                      }
                    }
                  }
                }
              }
            },
            "401": {
              "description": "未认证"
            }
          },
          "security": [
            {
              "jwt": []
            }
          ],
          "summary": "获取当前登录用户信息",
          "tags": [
            "用户认证"
          ]
        }
      },
      "/api/auth/refresh": {
        "post": {
          "description": "使用当前有效的JWT令牌获取新的访问令牌",
          "operationId": "AuthController_refreshToken",
          "parameters": [],
          "responses": {
            "200": {
              "description": "刷新成功",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "access_token": {
                        "type": "string",
                        "example": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                        "description": "新的JWT访问令牌"
                      },
                      "expires_in": {
                        "type": "number",
                        "example": 3600,
                        "description": "令牌过期时间（秒）"
                      }
                    }
                  }
                }
              }
            },
            "401": {
              "description": "未认证"
            }
          },
          "security": [
            {
              "jwt": []
            }
          ],
          "summary": "刷新访问令牌",
          "tags": [
            "用户认证"
          ]
        }
      },
      "/comments": {
        "post": {
          "operationId": "CommentController_create",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateCommentDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "评论创建成功"
            },
            "401": {
              "description": "未授权"
            },
            "404": {
              "description": "文章不存在"
            }
          },
          "security": [
            {
              "jwt": []
            }
          ],
          "summary": "创建评论",
          "tags": [
            "评论管理"
          ]
        }
      },
      "/comments/article/{articleId}": {
        "get": {
          "operationId": "CommentController_findByArticle",
          "parameters": [
            {
              "name": "articleId",
              "required": true,
              "in": "path",
              "description": "文章ID",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "page",
              "required": false,
              "in": "query",
              "description": "页码",
              "schema": {
                "default": 1,
                "example": 1,
                "type": "number"
              }
            },
            {
              "name": "limit",
              "required": false,
              "in": "query",
              "description": "每页数量",
              "schema": {
                "default": 20,
                "example": 20,
                "type": "number"
              }
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "description": "排序字段",
              "schema": {
                "default": "createdAt",
                "example": "createdAt",
                "type": "string",
                "enum": [
                  "createdAt",
                  "likeCount"
                ]
              }
            },
            {
              "name": "sortOrder",
              "required": false,
              "in": "query",
              "description": "排序方向",
              "schema": {
                "default": "DESC",
                "example": "DESC",
                "type": "string",
                "enum": [
                  "ASC",
                  "DESC"
                ]
              }
            },
            {
              "name": "status",
              "required": false,
              "in": "query",
              "description": "评论状态过滤",
              "schema": {
                "type": "string",
                "enum": [
                  "published",
                  "pending",
                  "hidden",
                  "deleted"
                ]
              }
            },
            {
              "description": "页码",
              "required": false,
              "name": "page",
              "in": "query",
              "schema": {
                "default": 1,
                "example": 1,
                "type": "number"
              }
            },
            {
              "description": "每页数量",
              "required": false,
              "name": "limit",
              "in": "query",
              "schema": {
                "default": 20,
                "example": 20,
                "type": "number"
              }
            },
            {
              "description": "排序字段",
              "required": false,
              "name": "sortBy",
              "in": "query",
              "schema": {
                "default": "createdAt",
                "example": "createdAt",
                "type": "string"
              }
            },
            {
              "description": "排序方向",
              "required": false,
              "name": "sortOrder",
              "in": "query",
              "schema": {
                "default": "DESC",
                "example": "DESC",
                "type": "string"
              }
            },
            {
              "description": "评论状态过滤",
              "required": false,
              "name": "status",
              "in": "query",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "获取成功"
            },
            "404": {
              "description": "文章不存在"
            }
          },
          "summary": "获取文章评论列表",
          "tags": [
            "评论管理"
          ]
        }
      },
      "/comments/{id}/replies": {
        "get": {
          "operationId": "CommentController_findReplies",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "description": "评论ID",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "page",
              "required": false,
              "in": "query",
              "description": "页码",
              "schema": {
                "default": 1,
                "example": 1,
                "type": "number"
              }
            },
            {
              "name": "limit",
              "required": false,
              "in": "query",
              "description": "每页数量",
              "schema": {
                "default": 20,
                "example": 20,
                "type": "number"
              }
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "description": "排序字段",
              "schema": {
                "default": "createdAt",
                "example": "createdAt",
                "type": "string",
                "enum": [
                  "createdAt",
                  "likeCount"
                ]
              }
            },
            {
              "name": "sortOrder",
              "required": false,
              "in": "query",
              "description": "排序方向",
              "schema": {
                "default": "DESC",
                "example": "DESC",
                "type": "string",
                "enum": [
                  "ASC",
                  "DESC"
                ]
              }
            },
            {
              "name": "status",
              "required": false,
              "in": "query",
              "description": "评论状态过滤",
              "schema": {
                "type": "string",
                "enum": [
                  "published",
                  "pending",
                  "hidden",
                  "deleted"
                ]
              }
            },
            {
              "description": "页码",
              "required": false,
              "name": "page",
              "in": "query",
              "schema": {
                "default": 1,
                "example": 1,
                "type": "number"
              }
            },
            {
              "description": "每页数量",
              "required": false,
              "name": "limit",
              "in": "query",
              "schema": {
                "default": 20,
                "example": 20,
                "type": "number"
              }
            },
            {
              "description": "排序字段",
              "required": false,
              "name": "sortBy",
              "in": "query",
              "schema": {
                "default": "createdAt",
                "example": "createdAt",
                "type": "string"
              }
            },
            {
              "description": "排序方向",
              "required": false,
              "name": "sortOrder",
              "in": "query",
              "schema": {
                "default": "DESC",
                "example": "DESC",
                "type": "string"
              }
            },
            {
              "description": "评论状态过滤",
              "required": false,
              "name": "status",
              "in": "query",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "获取成功"
            },
            "404": {
              "description": "评论不存在"
            }
          },
          "summary": "获取评论回复列表",
          "tags": [
            "评论管理"
          ]
        }
      },
      "/comments/user/{userId}": {
        "get": {
          "operationId": "CommentController_findByUser",
          "parameters": [
            {
              "name": "userId",
              "required": true,
              "in": "path",
              "description": "用户ID",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "page",
              "required": false,
              "in": "query",
              "description": "页码",
              "schema": {
                "default": 1,
                "example": 1,
                "type": "number"
              }
            },
            {
              "name": "limit",
              "required": false,
              "in": "query",
              "description": "每页数量",
              "schema": {
                "default": 20,
                "example": 20,
                "type": "number"
              }
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "description": "排序字段",
              "schema": {
                "default": "createdAt",
                "example": "createdAt",
                "type": "string",
                "enum": [
                  "createdAt",
                  "likeCount"
                ]
              }
            },
            {
              "name": "sortOrder",
              "required": false,
              "in": "query",
              "description": "排序方向",
              "schema": {
                "default": "DESC",
                "example": "DESC",
                "type": "string",
                "enum": [
                  "ASC",
                  "DESC"
                ]
              }
            },
            {
              "name": "status",
              "required": false,
              "in": "query",
              "description": "评论状态过滤",
              "schema": {
                "type": "string",
                "enum": [
                  "published",
                  "pending",
                  "hidden",
                  "deleted"
                ]
              }
            },
            {
              "description": "页码",
              "required": false,
              "name": "page",
              "in": "query",
              "schema": {
                "default": 1,
                "example": 1,
                "type": "number"
              }
            },
            {
              "description": "每页数量",
              "required": false,
              "name": "limit",
              "in": "query",
              "schema": {
                "default": 20,
                "example": 20,
                "type": "number"
              }
            },
            {
              "description": "排序字段",
              "required": false,
              "name": "sortBy",
              "in": "query",
              "schema": {
                "default": "createdAt",
                "example": "createdAt",
                "type": "string"
              }
            },
            {
              "description": "排序方向",
              "required": false,
              "name": "sortOrder",
              "in": "query",
              "schema": {
                "default": "DESC",
                "example": "DESC",
                "type": "string"
              }
            },
            {
              "description": "评论状态过滤",
              "required": false,
              "name": "status",
              "in": "query",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "获取成功"
            }
          },
          "summary": "获取用户评论列表",
          "tags": [
            "评论管理"
          ]
        }
      },
      "/comments/{id}": {
        "get": {
          "operationId": "CommentController_findOne",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "description": "评论ID",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "获取成功"
            },
            "404": {
              "description": "评论不存在"
            }
          },
          "summary": "获取评论详情",
          "tags": [
            "评论管理"
          ]
        },
        "put": {
          "operationId": "CommentController_update",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "description": "评论ID",
              "schema": {
                "type": "number"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateCommentDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "更新成功"
            },
            "401": {
              "description": "未授权"
            },
            "403": {
              "description": "无权限"
            },
            "404": {
              "description": "评论不存在"
            }
          },
          "security": [
            {
              "jwt": []
            }
          ],
          "summary": "更新评论",
          "tags": [
            "评论管理"
          ]
        },
        "delete": {
          "operationId": "CommentController_remove",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "description": "评论ID",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "删除成功"
            },
            "401": {
              "description": "未授权"
            },
            "403": {
              "description": "无权限"
            },
            "404": {
              "description": "评论不存在"
            }
          },
          "security": [
            {
              "jwt": []
            }
          ],
          "summary": "删除评论",
          "tags": [
            "评论管理"
          ]
        }
      },
      "/comments/{id}/like": {
        "post": {
          "operationId": "CommentController_like",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "description": "评论ID",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "点赞成功"
            },
            "401": {
              "description": "未授权"
            },
            "404": {
              "description": "评论不存在"
            }
          },
          "security": [
            {
              "jwt": []
            }
          ],
          "summary": "点赞评论",
          "tags": [
            "评论管理"
          ]
        },
        "delete": {
          "operationId": "CommentController_unlike",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "description": "评论ID",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "取消点赞成功"
            },
            "401": {
              "description": "未授权"
            },
            "404": {
              "description": "评论不存在"
            }
          },
          "security": [
            {
              "jwt": []
            }
          ],
          "summary": "取消点赞评论",
          "tags": [
            "评论管理"
          ]
        }
      }
    },
    "info": {
      "title": "Blog API",
      "description": "The Blog API documentation",
      "version": "1.0",
      "contact": {}
    },
    "tags": [],
    "servers": [],
    "components": {
      "securitySchemes": {
        "jwt": {
          "scheme": "bearer",
          "bearerFormat": "JWT",
          "type": "http"
        }
      },
      "schemas": {
        "RegisterDto": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "description": "学生姓名",
              "example": "张三",
              "minLength": 2,
              "maxLength": 20
            },
            "email": {
              "type": "string",
              "description": "学校邮箱地址",
              "example": "zhangsan@university.edu.cn",
              "format": "email"
            },
            "password": {
              "type": "string",
              "description": "校园系统密码",
              "example": "password123",
              "minLength": 6,
              "maxLength": 20
            },
            "username": {
              "type": "string",
              "description": "用户名（唯一标识）",
              "example": "zhangsan2024",
              "minLength": 3,
              "maxLength": 30
            }
          },
          "required": [
            "name",
            "email",
            "password",
            "username"
          ]
        },
        "UserResponseDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number",
              "description": "用户ID",
              "example": 1
            },
            "username": {
              "type": "string",
              "description": "用户名",
              "example": "zhangsan2024"
            },
            "nickname": {
              "type": "string",
              "description": "用户昵称",
              "example": "张三"
            },
            "email": {
              "type": "string",
              "description": "邮箱地址",
              "example": "zhangsan@example.com"
            },
            "avatar": {
              "type": "string",
              "description": "头像URL",
              "example": "https://example.com/avatar.jpg"
            },
            "role": {
              "type": "string",
              "description": "用户角色",
              "enum": [
                "admin",
                "user"
              ],
              "example": "user"
            },
            "status": {
              "type": "string",
              "description": "用户状态",
              "enum": [
                "active",
                "inactive",
                "banned"
              ],
              "example": "active"
            },
            "createdAt": {
              "format": "date-time",
              "type": "string",
              "description": "创建时间",
              "example": "2023-12-01T10:30:00.000Z"
            }
          },
          "required": [
            "id",
            "username",
            "nickname",
            "email",
            "role",
            "status",
            "createdAt"
          ]
        },
        "UserProfileResponseDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number",
              "description": "用户ID",
              "example": 1
            },
            "username": {
              "type": "string",
              "description": "用户名",
              "example": "zhangsan2024"
            },
            "nickname": {
              "type": "string",
              "description": "用户昵称",
              "example": "张三"
            },
            "email": {
              "type": "string",
              "description": "邮箱地址",
              "example": "zhangsan@example.com"
            },
            "avatar": {
              "type": "string",
              "description": "头像URL",
              "example": "https://example.com/avatar.jpg"
            },
            "role": {
              "type": "string",
              "description": "用户角色",
              "enum": [
                "admin",
                "user"
              ],
              "example": "user"
            },
            "status": {
              "type": "string",
              "description": "用户状态",
              "enum": [
                "active",
                "inactive",
                "banned"
              ],
              "example": "active"
            },
            "createdAt": {
              "format": "date-time",
              "type": "string",
              "description": "创建时间",
              "example": "2023-12-01T10:30:00.000Z"
            },
            "name": {
              "type": "string",
              "description": "姓名",
              "example": "张三"
            },
            "phone": {
              "type": "string",
              "description": "手机号",
              "example": "13800138000"
            },
            "bio": {
              "type": "string",
              "description": "个人简介",
              "example": "这是我的个人简介"
            },
            "lastLoginAt": {
              "format": "date-time",
              "type": "string",
              "description": "最后登录时间",
              "example": "2023-12-01T10:30:00.000Z"
            },
            "updatedAt": {
              "format": "date-time",
              "type": "string",
              "description": "更新时间",
              "example": "2023-12-01T10:30:00.000Z"
            }
          },
          "required": [
            "id",
            "username",
            "nickname",
            "email",
            "role",
            "status",
            "createdAt",
            "name",
            "updatedAt"
          ]
        },
        "UpdateUserDto": {
          "type": "object",
          "properties": {
            "nickname": {
              "type": "string",
              "description": "用户昵称",
              "example": "新的昵称",
              "maxLength": 50
            },
            "avatar": {
              "type": "string",
              "description": "头像URL",
              "example": "https://example.com/new-avatar.jpg"
            },
            "bio": {
              "type": "string",
              "description": "个人简介",
              "example": "这是我的新个人简介",
              "maxLength": 500
            }
          }
        },
        "CreateArticleDto": {
          "type": "object",
          "properties": {
            "title": {
              "type": "string",
              "example": "NestJS最佳实践",
              "description": "文章标题",
              "minLength": 1,
              "maxLength": 100
            },
            "content": {
              "type": "string",
              "example": "本文详细讲解NestJS的核心功能...",
              "description": "文章主体内容"
            },
            "summary": {
              "type": "string",
              "example": "本文总结了NestJS框架的十大核心特性",
              "description": "文章摘要",
              "maxLength": 500
            },
            "coverImage": {
              "type": "string",
              "example": "https://example.com/cover.jpg",
              "description": "文章封面图URL"
            },
            "categoryIds": {
              "example": [
                1,
                3
              ],
              "description": "文章分类ID数组",
              "type": "array",
              "items": {
                "type": "number"
              }
            },
            "tagIds": {
              "example": [
                5,
                7
              ],
              "description": "文章标签ID数组",
              "type": "array",
              "items": {
                "type": "number"
              }
            },
            "status": {
              "type": "string",
              "enum": [
                "draft",
                "published",
                "deleted"
              ],
              "example": "published",
              "description": "文章状态"
            }
          },
          "required": [
            "title",
            "content",
            "categoryIds",
            "status"
          ]
        },
        "AuthorInfoDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number",
              "description": "作者ID",
              "example": 1
            },
            "username": {
              "type": "string",
              "description": "作者用户名",
              "example": "zhangsan2024"
            },
            "avatar": {
              "type": "string",
              "description": "作者头像URL",
              "example": "https://example.com/avatar.jpg"
            },
            "bio": {
              "type": "string",
              "description": "作者个人简介",
              "example": "热爱技术分享的程序员"
            }
          },
          "required": [
            "id",
            "username"
          ]
        },
        "ArticleResponseDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number",
              "description": "文章ID",
              "example": 1
            },
            "title": {
              "type": "string",
              "description": "文章标题",
              "example": "NestJS 最佳实践指南"
            },
            "status": {
              "type": "string",
              "description": "文章状态",
              "enum": [
                "draft",
                "published",
                "deleted"
              ],
              "example": "published"
            },
            "createdAt": {
              "type": "string",
              "description": "创建时间",
              "example": "2023-12-01T10:30:00.000Z"
            },
            "summary": {
              "type": "string",
              "description": "文章摘要",
              "example": "本文总结了NestJS开发中的最佳实践"
            },
            "coverImage": {
              "type": "string",
              "description": "封面图片URL",
              "example": "https://example.com/cover.jpg"
            },
            "viewCount": {
              "type": "number",
              "description": "阅读次数",
              "example": 1250
            },
            "likeCount": {
              "type": "number",
              "description": "点赞次数",
              "example": 38
            },
            "commentCount": {
              "type": "number",
              "description": "评论数量",
              "example": 15
            },
            "author": {
              "description": "作者信息",
              "allOf": [
                {
                  "$ref": "#/components/schemas/AuthorInfoDto"
                }
              ]
            }
          },
          "required": [
            "id",
            "title",
            "status",
            "createdAt",
            "viewCount",
            "likeCount",
            "commentCount",
            "author"
          ]
        },
        "PaginationMetaDto": {
          "type": "object",
          "properties": {
            "page": {
              "type": "number",
              "description": "当前页码",
              "example": 1
            },
            "limit": {
              "type": "number",
              "description": "每页数量",
              "example": 10
            },
            "total": {
              "type": "number",
              "description": "总记录数",
              "example": 156
            },
            "totalPages": {
              "type": "number",
              "description": "总页数",
              "example": 16
            },
            "hasNextPage": {
              "type": "boolean",
              "description": "是否有下一页",
              "example": true
            },
            "hasPreviousPage": {
              "type": "boolean",
              "description": "是否有上一页",
              "example": false
            }
          },
          "required": [
            "page",
            "limit",
            "total",
            "totalPages",
            "hasNextPage",
            "hasPreviousPage"
          ]
        },
        "ArticleListResponseDto": {
          "type": "object",
          "properties": {
            "list": {
              "description": "文章列表",
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/ArticleResponseDto"
              }
            },
            "meta": {
              "description": "分页信息",
              "allOf": [
                {
                  "$ref": "#/components/schemas/PaginationMetaDto"
                }
              ]
            }
          },
          "required": [
            "list",
            "meta"
          ]
        },
        "CategoryInfoDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number",
              "description": "分类ID",
              "example": 1
            },
            "name": {
              "type": "string",
              "description": "分类名称",
              "example": "技术教程"
            }
          },
          "required": [
            "id",
            "name"
          ]
        },
        "TagInfoDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number",
              "description": "标签ID",
              "example": 1
            },
            "name": {
              "type": "string",
              "description": "标签名称",
              "example": "NestJS"
            }
          },
          "required": [
            "id",
            "name"
          ]
        },
        "ArticleDetailResponseDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number",
              "description": "文章ID",
              "example": 1
            },
            "title": {
              "type": "string",
              "description": "文章标题",
              "example": "NestJS 最佳实践指南"
            },
            "status": {
              "type": "string",
              "description": "文章状态",
              "enum": [
                "draft",
                "published",
                "deleted"
              ],
              "example": "published"
            },
            "createdAt": {
              "type": "string",
              "description": "创建时间",
              "example": "2023-12-01T10:30:00.000Z"
            },
            "summary": {
              "type": "string",
              "description": "文章摘要",
              "example": "本文总结了NestJS开发中的最佳实践"
            },
            "coverImage": {
              "type": "string",
              "description": "封面图片URL",
              "example": "https://example.com/cover.jpg"
            },
            "viewCount": {
              "type": "number",
              "description": "阅读次数",
              "example": 1250
            },
            "likeCount": {
              "type": "number",
              "description": "点赞次数",
              "example": 38
            },
            "commentCount": {
              "type": "number",
              "description": "评论数量",
              "example": 15
            },
            "author": {
              "description": "作者信息",
              "allOf": [
                {
                  "$ref": "#/components/schemas/AuthorInfoDto"
                }
              ]
            },
            "content": {
              "type": "string",
              "description": "文章内容（Markdown格式）",
              "example": "# NestJS 最佳实践\n\n这是一篇关于NestJS的详细教程..."
            },
            "categories": {
              "description": "文章分类列表",
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/CategoryInfoDto"
              }
            },
            "tags": {
              "description": "文章标签列表",
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/TagInfoDto"
              }
            },
            "liked": {
              "type": "boolean",
              "description": "当前用户是否已点赞",
              "example": false
            },
            "saved": {
              "type": "boolean",
              "description": "当前用户是否已收藏",
              "example": true
            },
            "publishedAt": {
              "type": "string",
              "description": "发布时间",
              "example": "2023-12-01T12:00:00.000Z"
            },
            "updatedAt": {
              "type": "string",
              "description": "更新时间",
              "example": "2023-12-01T15:30:00.000Z"
            }
          },
          "required": [
            "id",
            "title",
            "status",
            "createdAt",
            "viewCount",
            "likeCount",
            "commentCount",
            "author",
            "content",
            "categories",
            "tags",
            "liked",
            "saved",
            "updatedAt"
          ]
        },
        "UpdateArticleDto": {
          "type": "object",
          "properties": {
            "title": {
              "type": "string",
              "example": "更新后的文章标题",
              "description": "文章标题",
              "minLength": 1,
              "maxLength": 100
            },
            "content": {
              "type": "string",
              "example": "更新后的文章内容...",
              "description": "文章内容"
            },
            "summary": {
              "type": "string",
              "example": "更新后的文章摘要",
              "description": "文章摘要",
              "maxLength": 500
            },
            "coverImage": {
              "type": "string",
              "example": "https://example.com/new-cover.jpg",
              "description": "封面图片URL"
            },
            "categoryIds": {
              "example": [
                2,
                4
              ],
              "description": "文章分类ID数组",
              "type": "array",
              "items": {
                "type": "number"
              }
            },
            "tagIds": {
              "example": [
                1,
                3,
                7
              ],
              "description": "文章标签ID数组",
              "type": "array",
              "items": {
                "type": "number"
              }
            },
            "status": {
              "type": "string",
              "enum": [
                "draft",
                "published",
                "deleted"
              ],
              "example": "published",
              "description": "文章状态"
            }
          }
        },
        "LoginDto": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string",
              "description": "用户邮箱地址",
              "example": "zhangsan@university.edu.cn",
              "format": "email"
            },
            "password": {
              "type": "string",
              "description": "用户密码",
              "example": "password123",
              "minLength": 6,
              "maxLength": 50
            }
          },
          "required": [
            "email",
            "password"
          ]
        },
        "CreateCommentDto": {
          "type": "object",
          "properties": {
            "content": {
              "type": "string",
              "description": "评论内容",
              "example": "这是一条很棒的文章！",
              "minLength": 1,
              "maxLength": 1000
            },
            "articleId": {
              "type": "number",
              "description": "文章ID",
              "example": 1
            },
            "parentId": {
              "type": "number",
              "description": "父评论ID（回复评论时需要）",
              "example": 2
            }
          },
          "required": [
            "content",
            "articleId"
          ]
        },
        "UpdateCommentDto": {
          "type": "object",
          "properties": {
            "content": {
              "type": "string",
              "description": "评论内容",
              "example": "这是修改后的评论内容",
              "minLength": 1,
              "maxLength": 1000
            }
          }
        }
      }
    }
  },
  "customOptions": {}
};
  url = options.swaggerUrl || url
  let urls = options.swaggerUrls
  let customOptions = options.customOptions
  let spec1 = options.swaggerDoc
  let swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (let attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  let ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.initOAuth) {
    ui.initOAuth(customOptions.initOAuth)
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }
  
  window.ui = ui
}
