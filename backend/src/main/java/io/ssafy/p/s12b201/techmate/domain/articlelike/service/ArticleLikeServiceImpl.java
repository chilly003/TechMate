package io.ssafy.p.s12b201.techmate.domain.articlelike.service;

import io.ssafy.p.s12b201.techmate.domain.articlelike.domain.ArticleLike;
import io.ssafy.p.s12b201.techmate.domain.articlelike.domain.repository.ArticleLikeRepository;
import io.ssafy.p.s12b201.techmate.domain.user.domain.User;
import io.ssafy.p.s12b201.techmate.domain.user.domain.repository.UserRepository;
import io.ssafy.p.s12b201.techmate.global.exception.UserNotFoundException;
import io.ssafy.p.s12b201.techmate.global.utils.user.UserUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
public class ArticleLikeServiceImpl implements ArticleLikeService{

    private final UserUtils userUtils;
    private final UserRepository userRepository;
    private final ArticleLikeRepository articleLikeRepository;

    @Override
    @Transactional
    public void likeArticle(Long articleId) {
        // 사용자 검증
        User user = userUtils.getUserFromSecurityContext();
        Long userId = user.getId();
        userRepository.findById(userId)
                .orElseThrow(() -> UserNotFoundException.EXCEPTION);

        // 이미 좋아요한 기사인지 확인
        Optional<ArticleLike> existingLike = articleLikeRepository.findByUserIdAndArticleId(userId, articleId);

        if (existingLike.isPresent()) {
            // 이미 좋아요한 경우 좋아요 취소 (토글 방식)
            articleLikeRepository.delete(existingLike.get());
        } else {
            // 좋아요 추가
            ArticleLike articleLike = ArticleLike.builder()
                    .user(user)
                    .articleId(articleId)
                    .build();

            articleLikeRepository.save(articleLike);
        }
    }
}
