package io.ssafy.p.s12b201.techmate.domain.scrap.domain.repository;

import io.ssafy.p.s12b201.techmate.domain.scrap.domain.Memo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemoRepository extends JpaRepository<Memo, Long> {

}
