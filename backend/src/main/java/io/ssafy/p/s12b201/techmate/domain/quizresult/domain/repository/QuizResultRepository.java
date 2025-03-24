package io.ssafy.p.s12b201.techmate.domain.quizresult.domain.repository;

import io.ssafy.p.s12b201.techmate.domain.quizresult.domain.QuizResult;
import io.ssafy.p.s12b201.techmate.domain.scrap.domain.Scrap;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuizResultRepository extends JpaRepository<QuizResult, Long> {

}
