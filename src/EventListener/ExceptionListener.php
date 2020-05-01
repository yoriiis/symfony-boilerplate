<?php

namespace App\EventListener;

use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\HttpFoundation\Response;

class ExceptionListener
{
    /**
     * @var string
     */
    private $domainApi;

    public function __construct($router, $container, $domainApi)
    {
        $this->domainApi = $domainApi;
    }

    public function onKernelView(ViewEvent $event)
    {
        $request = $event->getRequest();
        if($request->getHost() === $this->domainApi){
            $controllerResult = $event->getControllerResult();

            if (is_array($controllerResult)) {

                $encoders = [new JsonEncoder()];
                $normalizers = [new ObjectNormalizer()];
                $serializer = new Serializer($normalizers, $encoders);

                // Serialize your object in Json
                $jsonObject = $serializer->serialize($controllerResult, 'json', [
                    'circular_reference_handler' => function ($object) {
                        return $object->getId();
                    }
                ]);

                $response = new Response($jsonObject);
                $response->headers->set('Content-Type', 'application/json');
                $event->setResponse($response);
            }
        }
    }
}
