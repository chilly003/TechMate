package io.ssafy.p.s12b201.techmate.domain.article.domain.repository;

import io.ssafy.p.s12b201.techmate.domain.article.domain.Article;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ArticleRepository extends MongoRepository<Article, String> {

    Optional<Article> findByArticleId(Long articleId);

    List<Article> findByArticleIdIn(List<Long> articleIds);
}
