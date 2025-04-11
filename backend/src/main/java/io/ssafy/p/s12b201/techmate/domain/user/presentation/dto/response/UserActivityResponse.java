package io.ssafy.p.s12b201.techmate.domain.user.presentation.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserActivityResponse {

    private int readArticlesCount;
    private int scrapArticlesCount;
    private int solvedQuizCount;

    public static UserActivityResponse from(int readArticlesCount, int scrapArticlesCount, int solvedQuizCount) {
        return UserActivityResponse.builder()
                .readArticlesCount(readArticlesCount)
                .scrapArticlesCount(scrapArticlesCount)
                .solvedQuizCount(solvedQuizCount)
                .build();
    }
}
