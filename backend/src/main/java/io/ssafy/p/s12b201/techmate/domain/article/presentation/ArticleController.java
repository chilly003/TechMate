package io.ssafy.p.s12b201.techmate.domain.article.presentation;

import io.ssafy.p.s12b201.techmate.domain.article.presentation.dto.requset.ArticleInitRequest;
import io.ssafy.p.s12b201.techmate.domain.article.service.ArticleUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/v1/articles")
@RequiredArgsConstructor
@RestController
public class ArticleController {

    private final ArticleUtils articleUtils;

    // 선호 기사 등록 (콜드 스타트 시 사용)
    @PostMapping("/random")
    public ResponseEntity<Void> initializeArticles(@RequestBody ArticleInitRequest request) {
        articleUtils.initializeArticles(request);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

//    @GetMapping("/{id}")
//    private void test(@PathVariable Long id) {
//        Article articleById = articleUtils.getArticleById(id);
//    }
}
