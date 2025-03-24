package io.ssafy.p.s12b201.techmate.global.api.controller;

import io.ssafy.p.s12b201.techmate.global.api.dto.Test;
import io.ssafy.p.s12b201.techmate.global.api.dto.response.ChatResponseDto;
import io.ssafy.p.s12b201.techmate.global.api.dto.response.OptionDto;
import io.ssafy.p.s12b201.techmate.global.api.dto.response.QuizDto;
import io.ssafy.p.s12b201.techmate.global.api.dto.response.QuizResponseDto;
import io.ssafy.p.s12b201.techmate.global.api.service.SolarProService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("test")
@RequiredArgsConstructor
@Slf4j
public class SolarController {

    private final SolarProService service;

    @GetMapping("")
    public void test(@RequestBody Test test) {

        ChatResponseDto chatResponseDto = service.chatWithSolarPro(test.getContent());

        log.info("chatResponseDto:{}", chatResponseDto.getCreated());
        log.info("chatSize={}", chatResponseDto.getChoices().size());
        log.info("chat={}", chatResponseDto.getChoices().get(0).getMessage().getContent());
    }

    @GetMapping("/v2")
    public void test2(@RequestBody Test test) {

        QuizResponseDto quizResponseDto = service.generateQuizzes(test.getContent());

        log.info("quiz Response size = {} ", quizResponseDto.getQuizzes().size());

        int i = 1;
        for (QuizDto quiz : quizResponseDto.getQuizzes()) {


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

    }
}
