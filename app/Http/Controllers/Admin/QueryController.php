<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactQuery;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QueryController extends Controller
{
    public function index()
    {
        $search = request()->query('search', '');
        $filter = request()->query('filter', 'all');
        
        $query = ContactQuery::query();

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('subject', 'like', "%{$search}%")
                  ->orWhere('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($filter !== 'all') {
            $query->where('status', $filter);
        }

        $queries = $query->orderBy('created_at', 'desc')->paginate(15);

        return Inertia::render('Admin/Queries/Index', [
            'queries' => $queries,
            'search' => $search,
            'filter' => $filter,
        ]);
    }

    public function show(ContactQuery $query)
    {
        return Inertia::render('Admin/Queries/Show', [
            'query' => $query,
        ]);
    }

    public function update(ContactQuery $query, Request $request): RedirectResponse
    {
        $request->validate([
            'status' => 'required|in:open,in-progress,resolved,closed',
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        $query->update([
            'status' => $request->status,
            'admin_notes' => $request->admin_notes,
        ]);

        return back()->with('success', 'Query updated successfully');
    }

    public function resolve(ContactQuery $query): RedirectResponse
    {
        $query->update(['status' => 'resolved']);

        return back()->with('success', 'Query marked as resolved');
    }

    public function destroy(ContactQuery $query): RedirectResponse
    {
        $query->delete();

        return redirect()->route('admin.queries.index')
            ->with('success', 'Query deleted successfully');
    }
}
