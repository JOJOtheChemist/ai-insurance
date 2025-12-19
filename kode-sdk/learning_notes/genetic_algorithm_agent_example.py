"""
遗传算法示例 - Agent风格命名
目标: 寻找函数 f(x) = x^2 的最大值，其中 x 在 [0, 31] 范围内
"""

import random
import math


class Agent:
    """代表遗传算法中的一个个体（Agent）"""
    
    def __init__(self, genes=None, gene_length=5):
        """
        初始化Agent
        :param genes: 基因序列（二进制列表）
        :param gene_length: 基因长度
        """
        self.gene_length = gene_length
        if genes is None:
            # 随机生成基因
            self.genes = [random.randint(0, 1) for _ in range(gene_length)]
        else:
            self.genes = genes
        self.fitness = 0
    
    def decode_genes(self):
        """将二进制基因解码为十进制数值"""
        value = 0
        for i, gene in enumerate(self.genes):
            value += gene * (2 ** (self.gene_length - 1 - i))
        return value
    
    def calculate_fitness(self):
        """计算Agent的适应度（fitness）"""
        x = self.decode_genes()
        self.fitness = x ** 2  # 目标函数 f(x) = x^2
        return self.fitness
    
    def __repr__(self):
        return f"Agent(genes={''.join(map(str, self.genes))}, value={self.decode_genes()}, fitness={self.fitness})"


class AgentPopulation:
    """代表Agent种群"""
    
    def __init__(self, population_size=10, gene_length=5):
        """
        初始化种群
        :param population_size: 种群大小
        :param gene_length: 每个Agent的基因长度
        """
        self.population_size = population_size
        self.gene_length = gene_length
        self.agents = [Agent(gene_length=gene_length) for _ in range(population_size)]
        self.generation = 0
        self.best_agent = None
    
    def evaluate_agents(self):
        """评估所有Agent的适应度"""
        for agent in self.agents:
            agent.calculate_fitness()
        
        # 记录最优Agent
        self.best_agent = max(self.agents, key=lambda a: a.fitness)
    
    def select_agents(self):
        """选择操作 - 轮盘赌选择法"""
        total_fitness = sum(agent.fitness for agent in self.agents)
        
        if total_fitness == 0:
            # 如果所有适应度都为0，随机选择
            return random.choices(self.agents, k=2)
        
        # 计算每个Agent的选择概率
        probabilities = [agent.fitness / total_fitness for agent in self.agents]
        
        # 选择两个父代Agent
        parent_agents = random.choices(self.agents, weights=probabilities, k=2)
        return parent_agents
    
    def crossover_agents(self, agent1, agent2, crossover_rate=0.7):
        """交叉操作 - 单点交叉"""
        if random.random() < crossover_rate:
            # 随机选择交叉点
            crossover_point = random.randint(1, self.gene_length - 1)
            
            # 创建两个新的子代Agent
            child_agent1_genes = agent1.genes[:crossover_point] + agent2.genes[crossover_point:]
            child_agent2_genes = agent2.genes[:crossover_point] + agent1.genes[crossover_point:]
            
            return Agent(genes=child_agent1_genes), Agent(genes=child_agent2_genes)
        else:
            # 不进行交叉，直接复制
            return Agent(genes=agent1.genes[:]), Agent(genes=agent2.genes[:])
    
    def mutate_agent(self, agent, mutation_rate=0.01):
        """变异操作 - 位翻转"""
        for i in range(len(agent.genes)):
            if random.random() < mutation_rate:
                agent.genes[i] = 1 - agent.genes[i]  # 位翻转
        return agent
    
    def evolve_agents(self, crossover_rate=0.7, mutation_rate=0.01):
        """进化到下一代"""
        new_agents = []
        
        # 精英保留策略：保留最优Agent
        elite_agent = Agent(genes=self.best_agent.genes[:])
        new_agents.append(elite_agent)
        
        # 生成新的Agent直到达到种群大小
        while len(new_agents) < self.population_size:
            # 选择父代
            parent_agent1, parent_agent2 = self.select_agents()
            
            # 交叉
            child_agent1, child_agent2 = self.crossover_agents(
                parent_agent1, parent_agent2, crossover_rate
            )
            
            # 变异
            child_agent1 = self.mutate_agent(child_agent1, mutation_rate)
            child_agent2 = self.mutate_agent(child_agent2, mutation_rate)
            
            new_agents.append(child_agent1)
            if len(new_agents) < self.population_size:
                new_agents.append(child_agent2)
        
        self.agents = new_agents
        self.generation += 1
    
    def run_evolution(self, generations=50, crossover_rate=0.7, mutation_rate=0.01, verbose=True):
        """运行遗传算法"""
        if verbose:
            print(f"开始遗传算法进化...")
            print(f"种群大小: {self.population_size}")
            print(f"基因长度: {self.gene_length}")
            print(f"进化代数: {generations}")
            print(f"交叉率: {crossover_rate}")
            print(f"变异率: {mutation_rate}")
            print("-" * 60)
        
        for gen in range(generations):
            # 评估当前代所有Agent
            self.evaluate_agents()
            
            if verbose and (gen % 10 == 0 or gen == generations - 1):
                print(f"第 {gen} 代 | 最优Agent: {self.best_agent}")
            
            # 进化到下一代
            if gen < generations - 1:
                self.evolve_agents(crossover_rate, mutation_rate)
        
        if verbose:
            print("-" * 60)
            print(f"进化完成！")
            print(f"最终最优Agent: {self.best_agent}")
            print(f"最优解 x = {self.best_agent.decode_genes()}")
            print(f"最优值 f(x) = {self.best_agent.fitness}")


def main():
    """主函数"""
    # 设置随机种子以便结果可复现
    random.seed(42)
    
    # 创建Agent种群
    agent_population = AgentPopulation(
        population_size=20,  # 种群中有20个Agent
        gene_length=5        # 每个Agent的基因长度为5位（可表示0-31）
    )
    
    # 运行进化过程
    agent_population.run_evolution(
        generations=100,      # 进化100代
        crossover_rate=0.75,  # 交叉率75%
        mutation_rate=0.02,   # 变异率2%
        verbose=True
    )


if __name__ == "__main__":
    main()
