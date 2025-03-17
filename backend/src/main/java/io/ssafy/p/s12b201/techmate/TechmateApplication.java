package io.ssafy.p.s12b201.techmate;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableJpaAuditing
@SpringBootApplication
public class TechmateApplication {

	public static void main(String[] args) {
		SpringApplication.run(TechmateApplication.class, args);
	}

}
