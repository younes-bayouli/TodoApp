package com.younes.server.model;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "web_push_subscriptions")
public class WebPushSubscription {

    @Id
    @Column(length = 700)
    private String endpoint;

    @Column(nullable = false, length = 256)
    private String p256dh;

    @Column(nullable = false, length = 256)
    private String auth;

    protected WebPushSubscription() {}   // required by JPA

    public WebPushSubscription(String endpoint, String p256dh, String auth) {
        this.endpoint = endpoint;
        this.p256dh = p256dh;
        this.auth = auth;
    }

    public String getEndpoint() { return endpoint; }
    public String getP256dh() { return p256dh; }
    public String getAuth() { return auth; }
}