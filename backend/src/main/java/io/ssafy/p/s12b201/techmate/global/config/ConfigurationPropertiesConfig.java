package io.ssafy.p.s12b201.techmate.global.config;

import io.ssafy.p.s12b201.techmate.global.property.JwtProperties;
import io.ssafy.p.s12b201.techmate.global.property.OauthProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@EnableConfigurationProperties({OauthProperties.class, JwtProperties.class})
@Configuration
public class ConfigurationPropertiesConfig {}