package top.devinwang.readChat.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

/**
 * @author devinWang
 * @Date 2023/5/4 20:27
 */
@Configuration
@EnableSwagger2
public class SwaggerConfig {
    @Bean
    public Docket createRestApi() {
        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo())
                // 是否开启（true 开启，false隐藏，生产环境建议隐藏）
                // .enable(false)
                .select()
                // 扫描的路径包，设置basePackage会将包下所有被@Api标记的所有方法作为api
                .apis(RequestHandlerSelectors.basePackage("top.devinwang.readChat.controller"))
                // 指定路径处理PathSelectors.any()代表所有的路径
                .paths(PathSelectors.any())
                .build();
    }

    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
                // 设置文档标题（API名称）
                .title("ReadChat接口测试")
                // 文档描述
                .description("测试接口")
                // 服务条款URL
                .termsOfServiceUrl("http://localhost:8080/")
                // 版本号
                .version("1.0.0")
                .build();
    }

}
