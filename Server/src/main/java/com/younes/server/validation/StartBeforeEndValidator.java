package com.younes.server.validation;

import com.younes.server.interfaces.HasStartEnd;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class StartBeforeEndValidator
        implements ConstraintValidator<StartBeforeEnd, HasStartEnd> {

    @Override
    public boolean isValid(HasStartEnd hasStartEnd, ConstraintValidatorContext context) {

        if (hasStartEnd.getStart() == null || hasStartEnd.getEnd() == null) {
            return true;
        }

        return hasStartEnd.isStartBeforeEnd();
    }
}