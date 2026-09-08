package com.younes.server.interfaces;

public interface HasStartEnd<T extends Comparable<? super T>> {
    
    T getStart();
    T getEnd();

    default boolean isStartBeforeEnd() {
        return getStart().compareTo(getEnd()) <= 0;
    }
}
