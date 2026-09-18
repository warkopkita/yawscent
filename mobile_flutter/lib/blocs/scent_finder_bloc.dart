import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../models/product_model.dart';

// Events
abstract class ScentFinderEvent extends Equatable {
  @override
  List<Object?> get props => [];
}

class AnswerQuestionEvent extends ScentFinderEvent {
  final String questionId;
  final String selectedOption;
  AnswerQuestionEvent(this.questionId, this.selectedOption);

  @override
  List<Object?> get props => [questionId, selectedOption];
}

class SubmitQuizEvent extends ScentFinderEvent {}
class ResetQuizEvent extends ScentFinderEvent {}

// States
abstract class ScentFinderState extends Equatable {
  @override
  List<Object?> get props => [];
}

class ScentFinderInitial extends ScentFinderState {
  final int currentStep;
  final Map<String, String> answers;
  ScentFinderInitial({this.currentStep = 0, this.answers = const {}});

  @override
  List<Object?> get props => [currentStep, answers];
}

class ScentFinderLoading extends ScentFinderState {}

class ScentFinderSuccess extends ScentFinderState {
  final Product recommendedProduct;
  final String matchReason;
  final int matchPercentage;

  ScentFinderSuccess({
    required this.recommendedProduct,
    required this.matchReason,
    required this.matchPercentage,
  });

  @override
  List<Object?> get props => [recommendedProduct, matchReason, matchPercentage];
}

class ScentFinderBloc extends Bloc<ScentFinderEvent, ScentFinderState> {
  final Map<String, String> _answers = {};
  int _step = 0;

  ScentFinderBloc() : super(ScentFinderInitial()) {
    on<AnswerQuestionEvent>((event, emit) {
      _answers[event.questionId] = event.selectedOption;
      _step++;
      emit(ScentFinderInitial(currentStep: _step, answers: Map.from(_answers)));
    });

    on<ResetQuizEvent>((event, emit) {
      _answers.clear();
      _step = 0;
      emit(ScentFinderInitial());
    });
  }
}
