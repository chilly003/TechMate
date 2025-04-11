package io.ssafy.p.s12b201.techmate.domain.user.service;


import io.ssafy.p.s12b201.techmate.domain.articleread.domain.repository.ArticleReadRepository;
import io.ssafy.p.s12b201.techmate.domain.quizresult.domain.repository.QuizResultRepository;
import io.ssafy.p.s12b201.techmate.domain.scrap.domain.repository.ScrapRepository;
import io.ssafy.p.s12b201.techmate.domain.user.domain.User;
import io.ssafy.p.s12b201.techmate.domain.user.domain.repository.UserRepository;
import io.ssafy.p.s12b201.techmate.domain.user.presentation.dto.request.UpdateNicknameRequest;
import io.ssafy.p.s12b201.techmate.domain.user.presentation.dto.response.TryToQuizDatesResponse;
import io.ssafy.p.s12b201.techmate.domain.user.presentation.dto.response.UserActivityResponse;
import io.ssafy.p.s12b201.techmate.domain.user.presentation.dto.response.UserNicknameResponse;
import io.ssafy.p.s12b201.techmate.global.exception.UserNotFoundException;
import io.ssafy.p.s12b201.techmate.global.utils.user.UserUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserUtils userUtils;
    private final ArticleReadRepository articleReadRepository;
    private final ScrapRepository scrapRepository;
    private final QuizResultRepository quizResultRepository;

    @Override
    @Transactional(readOnly = true)
    public UserNicknameResponse getUserNickname() {
        // 사용자 검증
        User user = userUtils.getUserFromSecurityContext();
        Long userId = user.getId();
        userRepository.findById(userId)
                .orElseThrow(() -> UserNotFoundException.EXCEPTION);

        return new UserNicknameResponse(user.getNickname(), user.getOauthProvider());
    }

    @Override
    @Transactional
    public UserNicknameResponse updateUserNickname(UpdateNicknameRequest request) {
        // 사용자 검증
        User user = userUtils.getUserFromSecurityContext();
        Long userId = user.getId();
        userRepository.findById(userId)
                .orElseThrow(() -> UserNotFoundException.EXCEPTION);

        String newNickname = request.getNickname();
        user.updateNickname(newNickname);
        userRepository.save(user);

        return new UserNicknameResponse(user.getNickname(), user.getOauthProvider());
    }

    @Override
    @Transactional(readOnly = true)
    public UserActivityResponse getUserActivity() {

        // 사용자 검증
        User user = userUtils.getUserFromSecurityContext();
        Long userId = user.getId();
        userRepository.findById(userId)
                .orElseThrow(() -> UserNotFoundException.EXCEPTION);

        // 읽은 기사 수 조회
        int readArticlesCount = articleReadRepository.countByUserId(userId);

        // 스크랩한 기사 수 조회
        int scrapArticlesCount = scrapRepository.countByUserId(userId);

        // 풀이한 퀴즈 수 조회
        int solvedQuizCount = quizResultRepository.countDistinctArticleIdByUserId(userId);

        return UserActivityResponse.from(readArticlesCount, scrapArticlesCount, solvedQuizCount);
    }

    /**
     * 현재 사용자의 퀴즈 시도 날짜 목록 조회
     */
    @Override
    @Transactional(readOnly = true)
    public TryToQuizDatesResponse getCorrectSolvedDates() {
        // 사용자 검증
        User user = userUtils.getUserFromSecurityContext();
        Long userId = user.getId();
        userRepository.findById(userId)
                .orElseThrow(() -> UserNotFoundException.EXCEPTION);

        // 날짜별 고유 기사 ID 개수를 직접 쿼리로 조회
        Map<LocalDate, Integer> tryToDates = quizResultRepository.countDistinctArticlesByDateAndUserId(userId)
                .stream()
                .collect(Collectors.toMap(
                        row -> ((java.sql.Date) row[0]).toLocalDate(),
                        row -> ((Number) row[1]).intValue()
                ));

        return TryToQuizDatesResponse.of(tryToDates);
    }
}
