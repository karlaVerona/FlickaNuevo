<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserGenre;
use Illuminate\Http\Request;

class UserGenreController extends Controller
{
    public function index(Request $request)
    {
        $genres = UserGenre::where('user_id', $request->user()->id)
            ->orderBy('position')
            ->get();

        return response()->json($genres);
    }

    public function store(Request $request)
    {
        $request->validate([
            'genres'            => 'required|array|min:1|max:3',
            'genres.*.genre'    => 'required|string|max:50',
            'genres.*.position' => 'required|integer|between:1,3',
        ]);

        $user = $request->user();

        UserGenre::where('user_id', $user->id)->delete();

        foreach ($request->genres as $item) {
            UserGenre::create([
                'user_id'  => $user->id,
                'genre'    => $item['genre'],
                'position' => $item['position'],
            ]);
        }

        $user->update(['genre_updated_at' => now()]);

        return response()->json([
            'message' => 'Géneros actualizados correctamente.',
            'genres'  => UserGenre::where('user_id', $user->id)->orderBy('position')->get()
        ]);
    }

    public function miClub(Request $request)
    {
        $genres = UserGenre::where('user_id', $request->user()->id)
            ->orderBy('position')
            ->pluck('genre')
            ->toArray();

        return response()->json([
            'club'    => $this->calcularClub($genres),
            'generos' => $genres,
        ]);
    }

    private function calcularClub(array $genres): array
    {
        $clubs = [
            'Noctámbulo'   => ['Terror', 'Thriller', 'Crimen'],
            'Maratón'      => ['Animación', 'Comedia', 'Aventura'],
            'Sin Corazón'  => ['Drama', 'Romance', 'Musical'],
            'Multiverse'   => ['Ciencia Ficción', 'Fantasía', 'Acción'],
            'Metamorfosis' => ['Comedia Romántica', 'Comedia Musical'],
            'Emocional'    => ['Drama', 'Romance', 'Comedia Romántica'],
            'Heroico'      => ['Acción', 'Aventura', 'Fantasía'],
        ];

        $puntos = [];
        foreach ($clubs as $nombre => $generosClub) {
            $puntos[$nombre] = count(array_intersect($genres, $generosClub));
        }

        $maxPuntos = max($puntos);

        if ($maxPuntos === 0) {
            return $this->datosClub('Espontáneo');
        }

        arsort($puntos);
        $ganador = array_key_first($puntos);

        return $this->datosClub($ganador);
    }

    private function datosClub(string $nombre): array
    {
        $clubs = [
            'Noctámbulo'   => [
                'nombre'      => 'Club Noctámbulo',
                'emoji'       => '🌙',
                'descripcion' => 'Mientras el mundo duerme, tú enciendes la pantalla. Los del Club Noctámbulo viven para el suspenso, el terror y los misterios que no se atreven a ver a plena luz del día. Cada película es una experiencia al límite, donde la adrenalina y el miedo se convierten en tu forma favorita de sentir que estás vivo.',
                'imagen'      => '/images/clubs/nocturno.jpg',
            ],
            'Maratón'      => [
                'nombre'      => 'Club del Maratón',
                'emoji'       => '🍿',
                'descripcion' => 'Para ti, una película nunca es suficiente. El Club del Maratón es para quienes se sientan con la intención de ver una sola película y terminan viendo cinco. Animación, comedia y aventura son tu combo perfecto: entretenimiento puro, risas garantizadas y la promesa de que siempre hay una más que vale la pena ver.',
                'imagen'      => '/images/clubs/maraton.jpg',
            ],
            'Sin Corazón'  => [
                'nombre'      => 'Club Sin Corazón',
                'emoji'       => '💀',
                'descripcion' => 'Bienvenido al club de los que lloran solos en la oscuridad y lo disfrutan. El Club Sin Corazón es para quienes buscan activamente películas que los destrocen por dentro, que les aprieten el pecho y les recuerden que sentir duele pero también es hermoso. Drama, romance y música que te rompe el alma, exactamente como lo pediste.',
                'imagen'      => '/images/clubs/sincorazon.jpg',
            ],
            'Multiverse'   => [
                'nombre'      => 'Club Multiverse',
                'emoji'       => '🌈',
                'descripcion' => 'La realidad te queda pequeña. El Club Multiverse reúne a los que prefieren explorar galaxias lejanas, mundos de magia y batallas épicas antes que quedarse en lo ordinario. Ciencia ficción, fantasía y acción son tu pasaporte a universos donde todo es posible y los límites de la imaginación no existen.',
                'imagen'      => '/images/clubs/multiverse.jpg',
            ],
            'Metamorfosis' => [
                'nombre'      => 'Club Metamorfosis',
                'emoji'       => '🦋',
                'descripcion' => 'Tú no ves películas, las vives. El Club Metamorfosis es para los que necesitan sentir mariposas aunque sea en pantalla, para los que se enamoran de los personajes y salen del cine con una sonrisa que no pueden explicar. Comedia romántica y musical son tu lenguaje, porque crees que la vida merece más momentos de esos que te hacen el corazón grande.',
                'imagen'      => '/images/clubs/metamorfosis.jpg',
            ],
            'Emocional'    => [
                'nombre'      => 'Club Emocional',
                'emoji'       => '🌊',
                'descripcion' => 'No te conformas con ver una película, necesitas que te mueva algo por dentro. El Club Emocional es para los que buscan conexión real con los personajes, historias que los hagan reflexionar y sentimientos que tarden días en irse. Drama profundo, romance intenso y comedias que esconden verdades incómodas son exactamente lo que tu corazón pide.',
                'imagen'      => '/images/clubs/emocional.jpg',
            ],
            'Heroico'      => [
                'nombre'      => 'Club Heroico',
                'emoji'       => '🦸',
                'descripcion' => 'Siempre vas con el protagonista, sin importar lo que cueste. El Club Heroico es para los que se levantan del sillón cuando el héroe gana, los que creen en la valentía, la lealtad y las historias donde al final el bien triunfa. Acción, aventura y fantasía épica son tu terreno, porque cada película es una batalla que merece ser ganada.',
                'imagen'      => '/images/clubs/heroico.jpg',
            ],
            'Espontáneo'   => [
                'nombre'      => 'Club Espontáneo',
                'emoji'       => '⚡',
                'descripcion' => 'Eres un misterio hasta para ti mismo. El Club Espontáneo reúne a los que no se casan con ningún género, a los que un día quieren terror y al siguiente una comedia romántica sin ningún tipo de remordimiento. Tu lista de pendientes es un caos glorioso y eso es exactamente lo que te hace el cinéfilo más interesante de todos.',
                'imagen'      => '/images/clubs/espontaneo.jpg',
            ],
        ];

        return $clubs[$nombre];
    }
}