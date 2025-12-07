package de.elbe5.base;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.Locale;

public class DateHelper {

    static DateTimeFormatter isoDateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'");
    static DateTimeFormatter isoDateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'00:00:00'Z'");

    public static Date asDate(LocalDate localDate) {
        if (localDate==null)
            return null;
        return Date.from(localDate.atStartOfDay().atZone(ZoneId.systemDefault()).toInstant());
    }

    public static Date asDate(LocalDateTime localDateTime) {
        if (localDateTime==null)
            return null;
        return Date.from(localDateTime.atZone(ZoneId.systemDefault()).toInstant());
    }

    public static LocalDate asLocalDate(Date date) {
        return asLocalDate(date, ZoneId.systemDefault());
    }

    public static LocalDate asLocalDate(Date date, ZoneId zoneId) {
        if (date==null)
            return null;
        return Instant.ofEpochMilli(date.getTime()).atZone(zoneId).toLocalDate();
    }

    public static LocalDateTime asLocalDateTime(Date date) {
        return asLocalDateTime(date, ZoneId.systemDefault());
    }

    public static LocalDateTime asLocalDateTime(Date date, ZoneId zoneId) {
        if (date==null)
            return null;
        return Instant.ofEpochMilli(date.getTime()).atZone(zoneId).toLocalDateTime();
    }

    public static long asMillis(LocalDate localDate) {
        if (localDate==null)
            return 0;
        return asDate(localDate).getTime();
    }

    public static long asMillis(LocalDateTime localDateTime) {
        if (localDateTime==null)
            return 0;
        return asDate(localDateTime).getTime();
    }

    public static LocalDate asLocalDate(long millis) {
        return asLocalDate(millis, ZoneId.systemDefault());
    }

    public static LocalDate asLocalDate(long millis, ZoneId zoneId) {
        if (millis==0)
            return null;
        return Instant.ofEpochMilli(millis).atZone(zoneId).toLocalDate();
    }

    public static LocalDateTime asLocalDateTime(long millis) {
        return asLocalDateTime(millis, ZoneId.systemDefault());
    }

    public static LocalDateTime asLocalDateTime(long millis, ZoneId zoneId) {
        if (millis==0)
            return null;
        return Instant.ofEpochMilli(millis).atZone(zoneId).toLocalDateTime();
    }

    public static String getDatePattern(Locale locale){
        return LocalizedStrings.getInstance().string("datePattern", locale);
    }

    public static String getDateTimePattern(Locale locale){
        return LocalizedStrings.getInstance().string("dateTimePattern", locale);
    }

    public static String getTimePattern(Locale locale){
        return LocalizedStrings.getInstance().string("timePattern", locale);
    }

    public static String toHtmlDate(LocalDate date, Locale locale) {
        if (date == null)
            return "";
        return date.format(DateTimeFormatter.ofPattern(getDatePattern(locale)));
    }

    public static String toHtmlDate(LocalDateTime date, Locale locale) {
        if (date == null)
            return "";
        return date.format(DateTimeFormatter.ofPattern(getDatePattern(locale)));
    }

    public static LocalDate fromDate(String s, Locale locale) {
        if (s == null || s.isEmpty())
            return null;
        return LocalDate.parse(s, DateTimeFormatter.ofPattern(getDatePattern(locale)));
    }

    public static String toHtmlTime(LocalTime date, Locale locale) {
        if (date == null)
            return "";
        return date.format(DateTimeFormatter.ofPattern(getTimePattern(locale)));
    }

    public static LocalTime fromTime(String s, Locale locale) {
        if (s == null || s.isEmpty())
            return null;
        return LocalTime.parse(s, DateTimeFormatter.ofPattern(getTimePattern(locale)));
    }

    public static String toHtmlDateTime(LocalDateTime date, Locale locale) {
        if (date == null)
            return "";
        return date.format(DateTimeFormatter.ofPattern(getDateTimePattern(locale)));
    }

    public static LocalDateTime fromDateTime(String s, Locale locale) {
        if (s == null || s.isEmpty())
            return null;
        return LocalDateTime.parse(s, DateTimeFormatter.ofPattern(getDateTimePattern(locale)));
    }

    public static String toHtml(LocalDateTime date, Locale locale){
        return toHtmlDateTime(date, locale);
    }

    public static String toISODateTime(LocalDateTime date) {
        if (date == null)
            return "";
        return date.format(isoDateTimeFormatter);
    }

    public static String toISODate(LocalDate date) {
        if (date == null)
            return "";
        return date.format(isoDateFormatter);
    }

    public static LocalDateTime fromISODateTime(String s) {
        if (s == null || s.isEmpty())
            return null;
        return LocalDateTime.parse(s, isoDateTimeFormatter);
    }

    public static LocalDate fromISODate(String s) {
        if (s == null || s.isEmpty())
            return null;
        return LocalDate.parse(s, isoDateTimeFormatter);
    }
}
