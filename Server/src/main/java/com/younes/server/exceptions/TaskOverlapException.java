package com.younes.server.exceptions;

public class TaskOverlapException extends RuntimeException {
    public TaskOverlapException(String message){
        super(message);
    }
}
