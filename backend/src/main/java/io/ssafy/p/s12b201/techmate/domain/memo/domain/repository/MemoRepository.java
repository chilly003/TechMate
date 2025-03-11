package io.ssafy.p.s12b201.techmate.domain.memo.domain.repository;

import io.ssafy.p.s12b201.techmate.domain.memo.domain.Memo;
import io.ssafy.p.s12b201.techmate.domain.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemoRepository extends JpaRepository<Memo, Long> {

}
