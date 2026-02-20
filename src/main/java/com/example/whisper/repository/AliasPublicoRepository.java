package com.example.whisper.repository;

import com.example.whisper.entity.AliasPublico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AliasPublicoRepository extends JpaRepository<AliasPublico, Long> {
    List<AliasPublico> findByAliasContainingIgnoreCase(String alias);
}
