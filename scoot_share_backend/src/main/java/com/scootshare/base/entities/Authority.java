package com.scootshare.base.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;

@Entity
@Table(name="authority")
public class Authority implements GrantedAuthority {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JsonIgnore
    private User user;
    private String authority;
    public Authority(String authority, User user) {
        this.authority = authority;
        this.user = user;
    }
    public Authority(){}
    @Override
    public String getAuthority() {
        return authority;
    }
    public void setAuthority(String authority){
        this.authority=authority;
    }
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
