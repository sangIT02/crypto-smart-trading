package com.financial.stockapp.repository;

import com.financial.stockapp.entity.Model;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IModelRepository extends JpaRepository<Model,Long> {
    List<Model> findAll();

    Model findModelByName(String name);
}
