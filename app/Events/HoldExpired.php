<?php

namespace App\Events;

use App\Models\Hold;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class HoldExpired implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $hold;
    public $user;
    public $experience;

    /**
     * Create a new event instance.
     */
    public function __construct(Hold $hold)
    {
        $this->hold = $hold;
        $this->user = $hold->user;
        $this->experience = $hold->experience;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('user.' . $this->user->id),
        ];
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'hold_id' => $this->hold->id,
            'experience_id' => $this->experience->id,
            'experience_title' => $this->experience->title,
            'message' => "Your hold for {$this->experience->title} has expired.",
            'timestamp' => now(),
        ];
    }
}
