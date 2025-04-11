package io.ssafy.p.s12b201.techmate.domain.user.presentation.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Getter
@Builder
public class TryToQuizDatesResponse {

    private Map<LocalDate, Integer> tryToDates;

    public static TryToQuizDatesResponse of(Map<LocalDate, Integer> tryToDates) {
        return TryToQuizDatesResponse.builder()
                .tryToDates(tryToDates)
                .build();
    }
}
