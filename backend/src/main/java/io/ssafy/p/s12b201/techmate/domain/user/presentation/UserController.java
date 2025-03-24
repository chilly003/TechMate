package io.ssafy.p.s12b201.techmate.domain.user.presentation;

import io.ssafy.p.s12b201.techmate.domain.user.presentation.dto.response.TestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {

	@GetMapping("/test")
	public TestDto getFollowers(){
		return new TestDto("1");
	}

}
