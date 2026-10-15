package com.younes.server.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record PushSubscriptionDto(String endpoint, Keys keys) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Keys(String p256dh, String auth) {}
}