package com.kh.app.product.space.dto.request;

import com.kh.app.product.space.entity.Area;
import com.kh.app.product.space.entity.SpaceEntity;
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

    public SpaceEntity toEntity() {

        return SpaceEntity.builder()
                .name(name)
                .phone(phone)
                .email(email)
                .summary(summary)
                .description(description)
                .address1(address1)
                .address2(address2)
                .latitude(latitude)
                .longitude(longitude)
                .area(area)
                .visibleYn("N")
                .build();
    }

}
