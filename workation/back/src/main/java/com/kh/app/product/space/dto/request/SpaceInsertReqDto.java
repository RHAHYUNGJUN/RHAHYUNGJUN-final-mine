package com.kh.app.product.space.dto.request;

import com.kh.app.product.space.entity.Area;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class SpaceInsertReqDto {


    private String name;
    private String phone;
    private String email;

    private String summary;
    private String description;

    private String address1;
    private String address2;

    private BigDecimal latitude;
    private BigDecimal longitude;

    private Area area;

    private Long applyId;

    private List<Long> arcadeIdList;

    private List<SpacePictureReqDto> pictureList;

}
