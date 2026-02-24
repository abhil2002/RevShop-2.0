package com.revshop.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping
    public String securedEndpoint() {
        return "You are authenticated!";
    }
}
