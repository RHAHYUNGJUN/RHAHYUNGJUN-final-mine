package com.kh.app.product.space.dto.request;

import com.kh.app.product.space.entity.SpaceEntity;
import com.kh.app.product.space.entity.SpacePictureCategory;
import com.kh.app.product.space.entity.SpacePictureEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SpacePictureReqDto {

    private String filePath;

    private String originName;

    private String storedName;

    private String contentType;

    private Long fileSize;

    private String mainYn;

    private Integer sortOrder;

    private SpacePictureCategory category;

    public SpacePictureEntity toEntity(SpaceEntity space) {

        return SpacePictureEntity.builder()
                .space(space)
                .filePath(filePath)
                .originName(originName)
                .storedName(storedName)
                .contentType(contentType)
                .fileSize(fileSize)
                .mainYn(mainYn)
                .sortOrder(sortOrder)
                .category(category)
                .build();
    }



}
