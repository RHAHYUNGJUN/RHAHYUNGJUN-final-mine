package com.kh.app.product.space.controller;

import com.kh.app.product.space.dto.request.SpaceInsertReqDto;
import com.kh.app.product.space.service.SpaceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
@Slf4j
@RequiredArgsConstructor
public class SpaceApiController {

    private final SpaceService spaceService;

    @PostMapping
    public ResponseEntity<Long> insert(
            @RequestBody SpaceInsertReqDto reqDto
    ) {

        Long id = spaceService.insert(reqDto);

        return ResponseEntity.ok(id);
    }
}
