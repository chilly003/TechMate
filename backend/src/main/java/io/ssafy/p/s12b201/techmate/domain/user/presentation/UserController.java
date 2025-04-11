package io.ssafy.p.s12b201.techmate.domain.user.presentation;

import io.ssafy.p.s12b201.techmate.domain.user.presentation.dto.request.UpdateNicknameRequest;
import io.ssafy.p.s12b201.techmate.domain.user.presentation.dto.response.TryToQuizDatesResponse;
import io.ssafy.p.s12b201.techmate.domain.user.presentation.dto.response.TestDto;
import io.ssafy.p.s12b201.techmate.domain.user.presentation.dto.response.UserActivityResponse;
import io.ssafy.p.s12b201.techmate.domain.user.presentation.dto.response.UserNicknameResponse;
import io.ssafy.p.s12b201.techmate.domain.user.service.UserService;
import io.ssafy.p.s12b201.techmate.domain.user.service.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {

	private final UserService userService;

	@GetMapping("/test")
	public TestDto getFollowers(){
		return new TestDto("1");
	}

	// 닉네임 조회
	@GetMapping("/nickname")
	public UserNicknameResponse getUserNickname() {
		return userService.getUserNickname();
	}

	// 닉네임 수정
	@PatchMapping("/nickname")
	public UserNicknameResponse updateUserNickname(@RequestBody UpdateNicknameRequest request) {
		return userService.updateUserNickname(request);
	}

	// 활동 내역 조회 (읽은 기사의 개수, 스크랩한 기사의 개수, 퀴즈 풀이 개수)
	@GetMapping("/activity")
	public UserActivityResponse getUserActivity() {
		return userService.getUserActivity();
	}

	@GetMapping("/quiz")
	public TryToQuizDatesResponse getCorrectSolvedDates() {
		return userService.getCorrectSolvedDates();
	}

}
