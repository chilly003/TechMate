package io.ssafy.p.s12b201.techmate.domain.article.presentation;

import io.ssafy.p.s12b201.techmate.domain.article.presentation.dto.requset.QuizResultRequest;
import io.ssafy.p.s12b201.techmate.domain.article.presentation.dto.response.*;

import io.ssafy.p.s12b201.techmate.domain.article.service.ArticleServiceImpl;
import io.ssafy.p.s12b201.techmate.domain.article.service.ArticleUtils;
import io.ssafy.p.s12b201.techmate.global.api.dto.Test;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/v1/articles")
@RequiredArgsConstructor
@RestController
@Slf4j
public class ArticleController {

    private final ArticleUtils articleUtils;
    private final ArticleServiceImpl service;

    // 추천 기사 리스트 조회 (메인)
    @GetMapping("/recommend")
    public Slice<ArticleCardResponse> getRecommendArticles(
            @RequestParam(value = "page", defaultValue = "0") Integer page,
            @RequestParam(value = "size", defaultValue = "10") Integer size
    ) {
        PageRequest pageRequest = PageRequest.of(page, size);
        return articleUtils.getRecommendArticles(pageRequest);
    }

    // 최신순 기사 리스트 조회 (메인)
    @GetMapping("/recent")
    public Slice<ArticleCardResponse> getRecentArticles(
            @RequestParam(value = "page", defaultValue = "0") Integer page,
            @RequestParam(value = "size", defaultValue = "10") Integer size
    ) {
        PageRequest pageRequest = PageRequest.of(page, size);
        return articleUtils.getRecentArticles(pageRequest);
    }

    // 인기순 기사 리스트 조회 (메인)
    @GetMapping("/hot")
    public Slice<ArticleCardResponse> getHotArticles(
            @RequestParam(value = "page", defaultValue = "0") Integer page,
            @RequestParam(value = "size", defaultValue = "10") Integer size
    ) {
        PageRequest pageRequest = PageRequest.of(page, size);
        return articleUtils.getHotArticles(pageRequest);
    }

    // 카테고리별 기사 조회
    @GetMapping("/category")
    public Slice<ArticleCardResponse> getArticlesByCategory(
            @RequestParam("category") String category,
            @RequestParam(value = "page", defaultValue = "0") Integer page,
            @RequestParam(value = "size", defaultValue = "10") Integer size
    ) {
        PageRequest pageRequest = PageRequest.of(page, size);
        return articleUtils.getArticlesByCategory(category, pageRequest);

    }

    // 기사 상세보기
    @GetMapping("/{articleId}")
    public ArticleDetailResponse getArticleDetail(@PathVariable Long articleId) {
        return articleUtils.getArticleDetail(articleId);
    }

    // 기사 검색
    @GetMapping("/search")
    public Slice<ArticleCardResponse> searchArticles(
            @RequestParam("keyword") String keyword,
            @RequestParam(value = "page", defaultValue = "0") Integer page,
            @RequestParam(value = "size", defaultValue = "0") Integer size
            ) {
        PageRequest pageRequest = PageRequest.of(page, size);
        return articleUtils.searchArticles(keyword, pageRequest);
    }

//    @GetMapping("/{id}")
//    private void test(@PathVariable Long id) {
//        Article articleById = articleUtils.getArticleById(id);
//    }

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

    @GetMapping("/{articleId}/quiz")
    public QuizResponse getQuiz(@PathVariable Long articleId) {
        return service.getArticleWithQuizzes(articleId);
    }

    @PostMapping("/{articleId}/quiz")
    public void createQuiz(
            @PathVariable Long articleId,
            @RequestBody List<QuizResultRequest> quizResultRequest) {
        service.createQuizResult(articleId, quizResultRequest);
    }

    @GetMapping("/test")
    public KeywordDto test() {
        return new KeywordDto("test",1.0);
    }
}
