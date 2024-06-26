package com.licenta;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@EntityScan(basePackages = "com.licenta")
@ComponentScan(basePackages = "com.licenta")
public class StudcollabApplication {

	public static void main(String[] args) {
		SpringApplication.run(StudcollabApplication.class, args);
	}
}
