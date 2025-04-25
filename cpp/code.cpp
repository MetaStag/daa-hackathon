#include <iostream>
#include <vector>
#include <queue>
#include <iomanip>
#include <cmath>
using namespace std;

struct Edge {
    int to;
    double cost, fail_prob;
};

const double INF = 1e18;
const double EPS = 1e-8;

int main() {
    int N, M;
    cin >> N >> M;
    vector<vector<Edge>> graph(N);

    for (int i = 0; i < M; ++i) {
        int u, v;
        double cost, fail_prob;
        cin >> u >> v >> cost >> fail_prob;
        graph[u].push_back({v, cost, fail_prob});
    }
    int source, destination;
    cin >> source >> destination;

    vector<double> expected(N, INF);
    expected[destination] = 0.0;

    // Value iteration until convergence
    bool changed = true;
    while (changed) {
        changed = false;
        for (int u = 0; u < N; ++u) {
            if (u == destination) continue;
            double best = INF;
            for (auto &e : graph[u]) {
                double fallback = expected[u]; // fallback is current expected[u]
                double exp_cost = (1 - e.fail_prob) * (e.cost + expected[e.to]) + e.fail_prob * fallback;
                if (exp_cost < best) best = exp_cost;
            }
            if (fabs(expected[u] - best) > EPS) {
                expected[u] = best;
                changed = true;
            }
        }
    }

    cout << fixed << setprecision(2) << expected[source] << endl;
    return 0;
}