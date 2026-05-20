<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Georgia, serif; background: #0f0505; color: #e8d5b0; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 2rem; }
        .header { text-align: center; padding: 2rem 0; border-bottom: 2px solid #c9a84c; }
        .logo { font-size: 2.5rem; font-weight: 700; color: #c9a84c; letter-spacing: 4px; }
        .badge { display: inline-block; background: linear-gradient(to right, #c9a84c, #ae8c5f); color: #1a0a0a; padding: 0.3rem 1rem; border-radius: 20px; font-size: 0.85rem; font-weight: 700; margin-top: 0.5rem; }
        .content { padding: 2rem 0; }
        .titulo { font-size: 1.5rem; color: #c9a84c; margin-bottom: 1rem; }
        .texto { font-size: 1rem; line-height: 1.8; color: rgba(232, 213, 176, 0.8); }
        .comprobante { background: rgba(201, 168, 76, 0.1); border: 1px solid rgba(201, 168, 76, 0.3); border-radius: 12px; padding: 1.5rem; margin: 1.5rem 0; }
        .fila { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid rgba(201, 168, 76, 0.1); }
        .fila:last-child { border-bottom: none; }
        .label { color: rgba(232, 213, 176, 0.5); font-size: 0.9rem; }
        .valor { color: #e8d5b0; font-weight: 600; }
        .footer { text-align: center; padding: 2rem 0; border-top: 1px solid rgba(201, 168, 76, 0.2); font-size: 0.8rem; color: rgba(232, 213, 176, 0.3); }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Flicka</div>
            <div class="badge">PRO</div>
        </div>

        <div class="content">
            <h2 class="titulo">¡Bienvenido a Flicka PRO, {{ $user->username }}!</h2>
            <p class="texto">
                Tu suscripción ha sido activada exitosamente. Ahora tienes acceso a todas las funciones premium de Flicka.
            </p>

            <div class="comprobante">
                <div class="fila">
                    <span class="label">Plan</span>
                    <span class="valor">Flicka {{ ucfirst($plan) }}</span>
                </div>
                <div class="fila">
                    <span class="label">Usuario</span>
                    <span class="valor">{{ $user->username }}</span>
                </div>
                <div class="fila">
                    <span class="label">Correo</span>
                    <span class="valor">{{ $user->email }}</span>
                </div>
                <div class="fila">
                    <span class="label">Fecha de activación</span>
                    <span class="valor">{{ now()->setTimezone('America/Mexico_City')->format('d/m/Y H:i') }}</span>
                </div>
                <div class="fila">
                    <span class="label">Estado</span>
                    <span class="valor" style="color: #c9a84c;">✓ Activo</span>
                </div>
            </div>

            <p class="texto">
                Ahora puedes disfrutar de:
                <br>✨ Favoritas ilimitadas
                <br>📋 Listas ilimitadas
                <br>📊 Estadísticas completas
                <br>⭐ Sistema de 6 estrellas
            </p>
        </div>

        <div class="footer">
            © 2026 Flicka · Todos los derechos reservados<br>
            Creado por Lu, Kar y Andy
        </div>
    </div>
</body>
</html>