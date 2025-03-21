package io.ssafy.p.s12b201.techmate.global.api.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.ssafy.p.s12b201.techmate.global.api.client.SolarProClient;
import io.ssafy.p.s12b201.techmate.global.api.dto.request.ChatRequestDto;
import io.ssafy.p.s12b201.techmate.global.api.dto.request.MessageDto;
import io.ssafy.p.s12b201.techmate.global.api.dto.response.ChatResponseDto;
import io.ssafy.p.s12b201.techmate.global.api.dto.response.OptionDto;
import io.ssafy.p.s12b201.techmate.global.api.dto.response.QuizDto;
import io.ssafy.p.s12b201.techmate.global.api.dto.response.QuizResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
@Slf4j
public class SolarProService {

    private final SolarProClient solarProClient;
    private final ObjectMapper objectMapper;

    @Value("${solar-pro.api-key}")
    private String apiKey;

    public ChatResponseDto chatWithSolarPro(String userMessage) {
        try {
            MessageDto message = new MessageDto("user", userMessage);
            ChatRequestDto request = new ChatRequestDto(
                    "solar-pro",
                    Collections.singletonList(message),
                    false
            );

            String authorization = "Bearer " + apiKey;
            return solarProClient.chat(authorization, request);
        } catch (Exception e) {
            throw new RuntimeException("Failed to call SolarPro API: " + e.getMessage(), e);
        }
    }

    public String getAssistantMessage(String userMessage) {
        ChatResponseDto response = chatWithSolarPro(userMessage);
        if (response.getChoices() == null || response.getChoices().isEmpty()) {
            throw new IllegalStateException("No choices found in the response");
        }
        return response.getChoices().get(0).getMessage().getContent();
    }

    public QuizResponseDto generateQuizzes(String content) {
        String prompt = "다음 기사 데이터를 기반으로 객관식 퀴즈 3개를 생성해 주세요. 각 퀴즈는 기사 내용과 관련된 질문을 기반으로 하며, 3개의 선택지를 가져야 합니다. 선택지 중 **정확히 하나**만 정답(is_correct: true)이어야 하고, 나머지 두 개는 오답(is_correct: false)이어야 합니다. 질문과 선택지는 한국어로 작성해 주세요. 출력은 JSON 형식으로, 아래 구조를 따라야 합니다:\n" +
                "\n" +
                "{\n" +
                "  \"quizzes\": [\n" +
                "    {\n" +
                "      \"quiz_id\": 1,\n" +
                "      \"question\": \"질문 예시\",\n" +
                "      \"options\": [\n" +
                "        {\"option_id\": 1, \"text\": \"선지 1\", \"is_correct\": false},\n" +
                "        {\"option_id\": 2, \"text\": \"선지 2\", \"is_correct\": true},\n" +
                "        {\"option_id\": 3, \"text\": \"선지 3\", \"is_correct\": false}\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"quiz_id\": 2,\n" +
                "      \"question\": \"질문 예시\",\n" +
                "      \"options\": [\n" +
                "        {\"option_id\": 1, \"text\": \"선지 1\", \"is_correct\": false},\n" +
                "        {\"option_id\": 2, \"text\": \"선지 2\", \"is_correct\": false},\n" +
                "        {\"option_id\": 3, \"text\": \"선지 3\", \"is_correct\": true}\n" +
                "      ]\n" +
                "    },\n" +
                "    {\n" +
                "      \"quiz_id\": 3,\n" +
                "      \"question\": \"질문 예시\",\n" +
                "      \"options\": [\n" +
                "        {\"option_id\": 1, \"text\": \"선지 1\", \"is_correct\": true},\n" +
                "        {\"option_id\": 2, \"text\": \"선지 2\", \"is_correct\": false},\n" +
                "        {\"option_id\": 3, \"text\": \"선지 3\", \"is_correct\": false}\n" +
                "      ]\n" +
                "    }\n" +
                "  ]\n" +
                "}\n" +
                "\n" +
                "### 기사 데이터\n" +
                "- 본문: " + content + "\n" +
                "\n" +
                "### 추가 지침\n" +
                "- 퀴즈 질문은 기사 본문의 주요 내용을 기반으로 작성하세요.\n" +
                "- 키워드를 활용하여 질문과 선택지를 구성하면 더 좋습니다.\n" +
                "- 각 퀴즈는 객관식 문제로, 선택지(`options`)는 3개로 구성하세요.\n" +
                "- 선택지의 `text` 필드에는 객관식 선지를 넣고, 오답은 기사 내용과 관련이 있으면서도 혼동을 줄 수 있는 내용으로 작성하세요.\n" +
                "- `is_correct` 필드는 정답인 선택지에만 `true`로 설정하고, 나머지 두 선택지는 `false`로 설정하세요. 한 퀴즈당 `is_correct: true`는 반드시 하나만 존재해야 합니다.\n" +
                "- JSON 형식으로만 응답해 주세요.";

        String jsonResponse = getAssistantMessage(prompt);

        log.info("======== jsonResponse =============");
        log.info("jsonResponse data " + jsonResponse);
        log.info("======== jsonResponse end ===============");

        try {
            if (!jsonResponse.trim().startsWith("{")) {
                throw new IllegalStateException("Invalid JSON response from Solar API: " + jsonResponse);
            }
            QuizResponseDto quizResponse = objectMapper.readValue(jsonResponse, QuizResponseDto.class);


            log.info("quiz Response size = {} ", quizResponse.getQuizzes().size());

            int i = 1;
            for (QuizDto quiz : quizResponse.getQuizzes()) {


                log.info("======== quiz start ===============");
                log.info("quiz Response data " + i + "= {} ", quiz.getQuizId());
                log.info("quiz Response data " + i + "= {} ", quiz.getQuizId());
                log.info("======== quiz end ===============");

                for (OptionDto option : quiz.getOptions()) {
                    log.info("======== option start ===============");
                    log.info("option Response data " + i + "= {} ", option.getOptionId());
                    log.info("option Response data " + i + "= {} ", option.getText());
                    log.info("option Response data " + i + "= {} ", option.getIsCorrect());

                    log.info("======== option end ===============");

                }

                i++;
            }

            // 퀴즈 검증
            for (QuizDto quiz : quizResponse.getQuizzes()) {
                long correctCount = quiz.getOptions().stream()
                        .filter(OptionDto::getIsCorrect)
                        .count();
                if (correctCount != 1) {
                    throw new IllegalStateException("Each quiz must have exactly one correct option");
                }
            }

            return quizResponse;
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to parse quiz response: " + e.getMessage(), e);
        }
    }
}