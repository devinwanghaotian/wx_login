# wx_login
微信小程序的登录操作_小程序端
## 技术选型

前端使用的是微信小程序登录和Promise进行同步验证登录

后端使用的是JWT+Redis进行登录操作

## 实现步骤

### 登录模块实现：

![登录流程](http://www.devinwang.club/wp-content/uploads/2023/06/%E5%BE%AE%E4%BF%A1%E5%B0%8F%E7%A8%8B%E5%BA%8F%E7%99%BB%E5%BD%95-1024x911.png)

### 退出登录模块实现:

![退出登录流程](http://www.devinwang.club/wp-content/uploads/2023/06/%E9%80%80%E5%87%BA%E7%99%BB%E5%BD%95.png)

### 登录拦截器实现

添加拦截器配置类

```java
package top.devinwang.readChat.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import top.devinwang.readChat.interceptor.LoginInterceptor;

/**
 * 注册拦截器
 * @author devinWang
 * @Date 2023/5/24 12:06
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Autowired
    private LoginInterceptor loginInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(loginInterceptor)
                .addPathPatterns("/**")
                .excludePathPatterns("/login/**");
    }
}
```

对所有请求进行拦截，对login路径下的进行放行，后续对连接与非拦截请求做进一步配置

```java
package top.devinwang.readChat.interceptor;

import io.jsonwebtoken.Claims;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.HandlerInterceptor;
import top.devinwang.readChat.commonutils.RedisConstant;
import top.devinwang.readChat.commonutils.ResultCode;
import top.devinwang.readChat.entity.AuthUser;
import top.devinwang.readChat.utils.JWTUtils;
import top.devinwang.readChat.utils.ThreadLocalHandler;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.concurrent.TimeUnit;

/**
 * 登录拦截器
 * @author devinWang
 * @Date 2023/5/24 12:04
 */
@Slf4j
@Component
public class LoginInterceptor implements HandlerInterceptor {
    @Autowired
    private RedisTemplate redisTemplate;
    @Autowired
    private ThreadLocalHandler threadLocalHandler;

    /**
     * 将本次请求的用户信息删除
     */
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        threadLocalHandler.clear();
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        log.info("该请求已被登录拦截器拦截");
        String token = request.getHeader("token");
        // token 为空的情况
        if (!StringUtils.hasLength(token)) {
            handleFalseResponse(response);
            log.info("请求未包含 token 或 token 为空");
            return false;
        }
        // 解析 token
        try {
            Claims claims = JWTUtils.parseJWT(token);
            String openid = claims.get("openid", String.class);
            AuthUser user = (AuthUser) redisTemplate.opsForValue().get(RedisConstant.getUserLogin() + openid);
            if (user == null) {
                handleFalseResponse(response);
                log.info("通过redis没有查询到数据，表明该该用户登录已经过期。");
                return false;
            }
            // 延长过期时间
            redisTemplate.expire(RedisConstant.getUserLogin() + openid, 3, TimeUnit.DAYS);
            // 将用户信息存储在ThreadLocal中
            threadLocalHandler.setUser(user);
        } catch (Exception e) {
            log.info(String.valueOf(e));
            handleFalseResponse(response);
            log.info("解析token失败");
            return false;
        }
        return true;
    }

    private static void handleFalseResponse(HttpServletResponse response) throws Exception {
        response.setStatus(200);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        response.getWriter().write("\"code\":\"" + ResultCode.getNotLoginSkip() + "\"}");
        response.getWriter().flush();
    }
}
```

登录拦截器

1. 当 token 为空，返回登录
2. 当解析 token 失败，返回登录
3. 当访问 Redis 失效，返回登录
4. 当得到用户信息（①将用户信息存储在ThreadLocal中，②将Redis中的用户信息进行续约）

