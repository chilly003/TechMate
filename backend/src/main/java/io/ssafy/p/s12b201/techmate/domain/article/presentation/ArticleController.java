package io.ssafy.p.s12b201.techmate.domain.article.presentation;

import io.ssafy.p.s12b201.techmate.domain.article.presentation.dto.requset.ArticleInitRequest;
import io.ssafy.p.s12b201.techmate.domain.article.presentation.dto.response.ArticleCardResponse;

import io.ssafy.p.s12b201.techmate.domain.article.presentation.dto.response.ArticleDetailResponse;
import io.ssafy.p.s12b201.techmate.domain.article.service.ArticleUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/v1/articles")
@RequiredArgsConstructor
@RestController
public class ArticleController {

    private final ArticleUtils articleUtils;

    // 선호 기사 조회 (콜드 스타트 시 사용)
    @GetMapping("/random")
    public List<ArticleCardResponse> getRandomArticles() {
        return articleUtils.getRandomArticles();
    }

    // 선호 기사 등록 (콜드 스타트 시 사용)
    @PostMapping("/random")
    public void initializeArticles(@RequestBody ArticleInitRequest request) {
        articleUtils.initializeArticles(request);
    }

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

    // 뉴스카드 좋아요
    @PostMapping("/like/{articleId}")
    public void likeArticle(@PathVariable Long articleId) {
        articleUtils.likeArticle(articleId);
    }

    // 기사 상세보기
    @GetMapping("/{articleId}")
    public ArticleDetailResponse getArticleDetail(@PathVariable Long articleId) {
        return articleUtils.getArticleDetail(articleId);
    }


//    @GetMapping("/{id}")
//    private void test(@PathVariable Long id) {
//        Article articleById = articleUtils.getArticleById(id);
//    }
}
