package com.example.whisper.repository;

import com.example.whisper.entity.ReporteFalsedad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IReporteFalsedadRepository extends JpaRepository<ReporteFalsedad,Long> {
}
