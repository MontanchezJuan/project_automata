from automata.fa.dfa import DFA

from visual_automata.fa.dfa import VisualDFA

# new_dfa = VisualDFA(
#     states={'q0', 'q1', 'q2'},
#     input_symbols={'0', '1'},
#     transitions={
#         'q0': {'0': 'q0', '1': 'q1'},
#         'q1': {'0': 'q0', '1': 'q2'},
#         'q2': {'0': 'q2', '1': 'q1'}
#     },
#     initial_state='q0',
#     final_states={'q1'}
# )

# new_dfa.show_diagram(view=True)
DFA.show_diagram("aa*(a|(b|ab)*)+c")