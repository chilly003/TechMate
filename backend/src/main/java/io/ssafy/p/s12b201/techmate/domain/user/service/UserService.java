package io.ssafy.p.s12b201.techmate.domain.user.service;

import io.ssafy.p.s12b201.techmate.domain.user.presentation.dto.request.UpdateNicknameRequest;
import io.ssafy.p.s12b201.techmate.domain.user.presentation.dto.response.TryToQuizDatesResponse;
import io.ssafy.p.s12b201.techmate.domain.user.presentation.dto.response.UserActivityResponse;
import io.ssafy.p.s12b201.techmate.domain.user.presentation.dto.response.UserNicknameResponse;

public interface UserService {
    public UserNicknameResponse getUserNickname();

    public UserNicknameResponse updateUserNickname(UpdateNicknameRequest request);

    public UserActivityResponse getUserActivity();

    public TryToQuizDatesResponse getCorrectSolvedDates();
}
