package top.devinwang.readChat.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import top.devinwang.readChat.commonutils.R;
import top.devinwang.readChat.commonutils.ResultCode;
import top.devinwang.readChat.service.LoginService;

import javax.servlet.http.HttpServletRequest;

/**
 * @author devinWang
 * @Date 2023/5/19 21:56
 */
@Slf4j
@RestController
public class LoginController {
    @Autowired
    private LoginService loginService;

    @PostMapping("/login")
    public R login(String code) {
        log.info("code = [{}]", code);
        return loginService.login(code);

    }

    @GetMapping("/login/auth")
    public R auth(HttpServletRequest request) {
        boolean isAuth = loginService.isAuth(request);
        if (isAuth) {
            return R.ok().message("认证成功");
        } else {
            return R.error().code(ResultCode.getNotLogin()).message("认证失败");
        }
    }

    @PostMapping("/login/message")
    public R getMessage(HttpServletRequest request, String encryptedData, String iv) {
        return loginService.getMessage(request, encryptedData, iv);
    }

    @GetMapping("/login/logout")
    public R logout(HttpServletRequest request) {
        loginService.logout(request);
        return R.ok();
    }
}
