package com.younes.server.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "fcm_tokens")
public class FcmToken {

    @Id
    @Column(length = 512)
    private String token;

    protected FcmToken() {}          // required by JPA

    public FcmToken(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }
}