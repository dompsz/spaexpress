<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $to = "pszczolkowski.stanislaw@wp.pl";
    $subject = "Nowa wiadomość z formularza SpaExpress";
    
    $name = strip_tags(trim($_POST["name"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $message = trim($_POST["message"]);

    if (empty($name) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Proszę wypełnić wszystkie pola i podać poprawny e-mail.";
        exit;
    }

    $email_content = "Imię i nazwisko: $name\n";
    $email_content .= "Email: $email\n\n";
    $email_content .= "Wiadomość:\n$message\n";

    $email_headers = "From: $name <$email>";

    if (mail($to, $subject, $email_content, $email_headers)) {
        http_response_code(200);
        echo "Dziękujemy! Twoja wiadomość została wysłana.";
    } else {
        http_response_code(500);
        echo "Ups! Coś poszło nie tak i nie mogliśmy wysłać Twojej wiadomości.";
    }
} else {
    http_response_code(403);
    echo "Wystąpił problem z Twoim zgłoszeniem.";
}
?>
