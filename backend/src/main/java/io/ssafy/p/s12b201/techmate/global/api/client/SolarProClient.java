package io.ssafy.p.s12b201.techmate.global.api.client;

import feign.Headers;
import io.ssafy.p.s12b201.techmate.domain.article.presentation.dto.requset.ChatRequestDto;
import io.ssafy.p.s12b201.techmate.domain.article.presentation.dto.response.ChatResponseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;


@FeignClient(name = "solarProClient", url = "https://api.upstage.ai/v1/solar")
public interface SolarProClient {

	@PostMapping("/chat/completions")
	@Headers("Authorization: Bearer ${apiKey}")
	ChatResponseDto chat(@RequestHeader("Authorization") String apiKey, @RequestBody ChatRequestDto request);
}


