package com.kh.app.middle.apply.service;

import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.middle.apply.dto.req.SpaceApplyPermitReqDto;
import com.kh.app.middle.apply.dto.req.SpaceApplyReqDto;
import com.kh.app.middle.apply.dto.resp.SpaceApplyRespDto;
import com.kh.app.middle.apply.entity.SpaceApplyEntity;
import com.kh.app.middle.apply.repository.SpaceApplyRepository;
import com.kh.app.product.space.entity.SpaceEntity;
import com.kh.app.product.space.repository.SpaceRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;



@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SpaceApplyService {

    private final SpaceApplyRepository spaceApplyRepository;
    private final MemberRepository memberRepository;
    private final SpaceRepository spaceRepository;

    //등록 심사 신청
    @Transactional
    public void enroll(SpaceApplyReqDto dto, String name) {

        MemberEntity member = memberRepository.findByUsernameAndDeletedAtIsNull(name)
                .orElseThrow(()->{
                    throw new EntityNotFoundException("[MEMBER-2005] 존재하지 않는 회원입니다.");
                });

        SpaceEntity space = spaceRepository.findByIdAndDelYn(dto.getSpaceId(), "N")
                .orElseThrow(() -> {
                    throw new EntityNotFoundException("[SPACE-4001] 존재하지 않는 공간입니다.");
                });

        // 중복방지신청
        boolean alreadyApplied = spaceApplyRepository.existsPendingApply(member.getId(), dto.getSpaceId());
        if(alreadyApplied){
            throw new IllegalStateException("[SPACE-4011] 동일한 정보의 신청 건이 존재합니다.");
        }

        spaceApplyRepository.save(dto.toEntity(member, space));
    }


    // 신청 건 목록조회
    public Page<SpaceApplyRespDto> getApplyList(int pno) {
        Pageable pageable = PageRequest.of(pno, 10);
        return spaceApplyRepository
                .getList(pageable)
                .map(SpaceApplyRespDto::from);
    }

    // 심사
    public void update(Long applyId, SpaceApplyPermitReqDto dto) {
        SpaceApplyEntity apply = spaceApplyRepository.findByIdAndDelYn(applyId, "N")
                .orElseThrow(() -> {
                    throw new EntityNotFoundException("[SPACE-4012] 존재하지 않는 신청 건입니다.");
                });

        spaceApplyRepository.save(apply);
    }
}
