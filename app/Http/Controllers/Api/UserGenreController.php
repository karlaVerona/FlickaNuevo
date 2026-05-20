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
                'nombre'      => 'La Medianoche',
                'emoji'       => '',
                'descripcion' => 'Eres valiente, intenso y te encanta vivir al límite. Tienes una mente brillante que no descansa fácilmente, y por eso disfrutas las historias que te mantienen al borde del asiento. Te gusta adivinar el giro antes de que llegue, y cuando no puedes, te emociona más. Eres de los que apagan todas las luces para ver mejor, de los que no se asustan con facilidad pero secretamente buscan esa sensación. La gente te admira porque tienes carácter, y tus recomendaciones siempre son las más memorables de la noche.',
                'imagen'      => '/cartas/Medianoche.jpg',
            ],
            'Maratón'      => [
                'nombre'      => 'El Sol',
                'emoji'       => '',
                'descripcion' => 'Eres espontáneo, curioso y tienes una energía que contagia a todos a tu alrededor. Te encanta reír a carcajadas, explorar mundos nuevos y disfrutar cada momento sin complicarlo demasiado. Cuando algo te gusta, quieres más, y eso se nota en todo lo que haces. Eres el tipo de persona que convierte un plan sencillo en una aventura épica, y tus amigos saben que contigo nunca hay un momento aburrido. Tienes un lado juguetón que nunca has perdido, y eso, aunque no lo sepas, es uno de tus mejores regalos.',
                'imagen'      => '/cartas/Sol.jpg',
            ],
            'Sin Corazón'  => [
                'nombre'      => 'La Marea',
                'emoji'       => '',
                'descripcion' => 'Eres profundo, sensible y tienes una capacidad para sentir que muy poca gente entiende del todo. Te gustan las historias que duelen porque sabes que detrás de cada lágrima hay algo verdadero. Eres de los que lloran en el cine y no se avergüenzan, porque tienes claro que sentir mucho no es debilidad. La música te mueve el alma, los finales tristes te parecen los más honestos, y cuando una historia te llega al fondo, la llevas contigo días enteros. Amas con intensidad y lo demuestras en todo, hasta en lo que eliges ver.',
                'imagen'      => '/cartas/Marea.png',
            ],
            'Multiverse'   => [
                'nombre'      => 'La estrella',
                'emoji'       => '',
                'descripcion' => 'Eres imaginativo, inteligente y tienes una mente que nunca deja de hacerse preguntas. Este mundo siempre te pareció un poco pequeño, y por eso te atraen los universos que van más allá de lo posible. Te gusta pensar, debatir y encontrar el detalle que nadie más notó. Eres de los que salen del cine queriendo hablar durante horas sobre lo que acaban de ver. Tienes visión, y la gente a tu alrededor lo sabe porque siempre llegas con ideas que a los demás no se les habrían ocurrido.',
                'imagen'      => '/cartas/Estrella.png',
            ],
            'Metamorfosis' => [
                'nombre'      => 'La rosa',
                'emoji'       => '',
                'descripcion' => 'Eres cálido, romántico y tienes una manera de ver la vida que hace que todo parezca más bonito. Te gusta creer en el amor, en los finales felices y en que las cosas pasan por algo. Eres de los que sonríen solos viendo una escena que les llegó al corazón, de los que cantan sin darse cuenta cuando la música empieza. La gente disfruta estar contigo porque tienes el don de hacer sentir bien a los demás. No te da miedo ilusionarte, y eso habla de una valentía que muy pocos reconocen como tal, pero tú ya lo sabes.',
                'imagen'      => '/cartas/Rosa.png',
            ],
            'Emocional'    => [
                'nombre'      => 'La llama',
                'emoji'       => '',
                'descripcion' => 'Eres apasionado, empático y te conectas con los demás de una manera que pocos logran. Te gustan las historias que te revuelven algo por dentro, las que te hacen pensar en tu propia vida mientras las ves. Eres de los que sienten todo con una intensidad que a veces sorprende hasta a ti mismo. Tienes una inteligencia emocional enorme y la gente lo nota: siempre sabes qué decir, siempre sabes cómo estar. Una buena película para ti no es la que tiene el mejor presupuesto, sino la que te deja sintiéndote menos solo en el mundo.',
                'imagen'      => '/cartas/Llama.jpg',
            ],
            'Heroico'      => [
                'nombre'      => 'El Trueno',
                'emoji'       => '',
                'descripcion' => 'Eres leal, determinado y tienes un sentido de la justicia que no negocias con nadie. Te inspiran las personas que luchan por algo más grande que ellas mismas, y eso dice mucho de quién eres tú también. Te gusta la adrenalina, los momentos épicos y las historias donde el esfuerzo tiene recompensa. Eres de los que se levantan del sillón sin darse cuenta en la escena final, de los que salen del cine con energía extra. La gente confía en ti porque saben que cuando dices que vas a estar, estás. Eres, aunque no lo digas, el héroe de tu propia historia.',
                'imagen'      => '/cartas/Trueno.jpg',
            ],
            'Espontáneo'   => [
                'nombre'      => 'El loco',
                'emoji'       => '',
                'descripcion' => 'Eres libre, impredecible y tienes una personalidad que no cabe en ningún molde, y eso te hace fascinante. Un día quieres terror, al otro una comedia, y a veces terminas llorando con algo que ni tenías planeado ver. Te guías por el instinto, por el estado de ánimo, por lo que te pida el cuerpo en ese momento. Eres curioso, abierto y nunca prejuzgas una historia antes de darle oportunidad. La gente que te conoce sabe que siempre tienes una recomendación inesperada y siempre acierta. Eres el tipo de espectador que el cine ama, porque lo ves todo con ojos nuevos cada vez.',
                'imagen'      => '/cartas/Loco.jpg',
            ],
        ];

        return $clubs[$nombre];
    }
}